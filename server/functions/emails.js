const dayjs = require("dayjs");

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

	const threadPromises = [];
	for (const thread of threadIds) {
		url = `https://gmail.googleapis.com/gmail/v1/users/me/threads/${thread}`;

		threadPromises.push(api({ method: "get", url, headers }));
	}

	res = await Promise.all(threadPromises);

	const threads = [];
	for (const thread of res) {
		const messages = [];
		for (const message of thread.data.messages) {
			const formattedMessage = {};

			formattedMessage.id = message.id;
			formattedMessage.subject = message.payload.headers.find(h => h.name === "Subject").value;
			formattedMessage.from = message.payload.headers.find(h => h.name === "From").value;
			formattedMessage.to = message.payload.headers.find(h => h.name === "To").value;
			formattedMessage.dateSent = dayjs.unix(Number(message.internalDate) / 1000);
			if (!message.payload.parts) {
				formattedMessage.data = "";
			} else if (message.payload.parts[1] && message.payload.parts[1].body.data) {
				formattedMessage.data = Buffer.from(message.payload.parts[1].body.data, "base64").toString();
			} else if (message.payload.parts[0] && message.payload.parts[0].body.data) {
				formattedMessage.data = Buffer.from(message.payload.parts[0].body.data, "base64").toString();
			} else {
				formattedMessage.data = Buffer.from(message.payload.parts[0].parts[1].body.data, "base64").toString();
			}

			messages.push(formattedMessage);
		}

		threads.push({ id: thread.data.id, messages });
	}

	return response(200, "GET_EMAILS", threads);
}

async function getEmailLabels(event) {
	const { user } = event;

	const accessToken = await getAccessToken(user);

	if (accessToken.status === 401) return errors.gmailRefreshToken;

	const url = "https://www.googleapis.com/gmail/v1/users/me/labels";

	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	const res = await api({ method: "get", url, headers });

	const labels = res.data.labels
		.filter(label => label.type === "user")
		.map(label => ({ id: label.id, name: label.name }));

	return response(200, "GET_EMAIL_LABELS", labels);
}

async function editEmail(event) {
	const { params, body, user } = event;
	const { id } = params;
	const { label } = body;

	const accessToken = await getAccessToken(user);

	if (accessToken.status === 401) return errors.gmailRefreshToken;

	const url = `https://www.googleapis.com/gmail/v1/users/me/threads/${id}/modify`;

	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	const data = { addLabelIds: [label], removeLabelIds: ["INBOX"] };

	await api({ method: "post", url, headers, data });

	return response(200, "EDIT_EMAIL");
}

async function deleteEmail(event) {
	const { params, user } = event;
	const { id } = params;

	const accessToken = await getAccessToken(user);

	if (accessToken.status === 401) return errors.gmailRefreshToken;

	const url = `https://www.googleapis.com/gmail/v1/users/me/messages/${id}/trash`;

	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	await api({ method: "post", url, headers });

	return response(200, "DELETE_EMAIL");
}

module.exports = { getEmails, getEmailLabels, editEmail, deleteEmail };
