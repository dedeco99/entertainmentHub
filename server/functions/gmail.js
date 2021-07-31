const { response, api } = require("../utils/request");
const errors = require("../utils/errors");

const App = require("../models/app");

async function getAccessToken(user) {
	const app = await App.findOne({ user: user._id, platform: "gmail" }).lean();

	if (!app) return errors.gmailRefreshToken;

	const url = `https://www.googleapis.com/oauth2/v4/token?client_id=${process.env.youtubeClientId}&client_secret=${process.env.youtubeSecret}&refresh_token=${app.refreshToken}&grant_type=refresh_token`;

	const res = await api({ method: "post", url });
	const json = res.data;

	if (res.status === 400) {
		await App.deleteOne({ _id: app._id });

		return errors.gmailRefreshToken;
	}

	return json.access_token;
}

async function getEmails(event) {
	const { user } = event;

	const accessToken = await getAccessToken(user);

	if (accessToken.status === 401) return errors.gmailRefreshToken;

	let url = "https://www.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX";

	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	let res = await api({ method: "get", url, headers });

	const threadIds = [];

	if (!res.data.messages) return response(200, "GET_GMAIL_EMAILS", []);

	for (const message of res.data.messages) {
		if (!threadIds.includes(message.threadId)) threadIds.push(message.threadId);
	}

	const threads = [];
	for (const thread of threadIds) {
		url = `https://gmail.googleapis.com/gmail/v1/users/me/threads/${thread}`;

		res = await api({ method: "get", url, headers });
		const messages = [];
		for (const message of res.data.messages) {
			const formattedMessage = {};

			formattedMessage.subject = message.payload.headers.find(h => h.name === "Subject").value;
			formattedMessage.from = message.payload.headers.find(h => h.name === "From").value;
			formattedMessage.to = message.payload.headers.find(h => h.name === "To").value;
			if (message.payload.parts[1] && message.payload.parts[1].body.data) {
				formattedMessage.data = Buffer.from(message.payload.parts[1].body.data, "base64").toString();
			} else if (message.payload.parts[0] && message.payload.parts[0].body.data) {
				formattedMessage.data = Buffer.from(message.payload.parts[0].body.data, "base64").toString();
			} else {
				formattedMessage.data = Buffer.from(message.payload.parts[0].parts[1].body.data, "base64").toString();
			}

			messages.push(formattedMessage);
		}

		threads.push({ id: thread, messages });
	}

	return response(200, "GET_GMAIL_EMAILS", threads);
}

module.exports = { getEmails };
