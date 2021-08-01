const { response, api } = require("../utils/request");
const errors = require("../utils/errors");

const App = require("../models/app");

async function getApps(event) {
	const { user } = event;

	const apps = await App.find({ user: user._id }, "-refreshToken");

	return response(200, "GET_APPS", apps);
}

async function addApp(event) {
	const { body, user } = event;
	const { platform, code } = body;
	const appExists = await App.findOne({ user: user._id, platform });

	if (appExists) return errors.duplicated;

	let json = {};
	switch (platform) {
		case "reddit": {
			const url = `https://www.reddit.com/api/v1/access_token?code=${code}&grant_type=authorization_code&redirect_uri=${process.env.redirect}/apps/reddit`;

			const encryptedAuth = new Buffer.from(`${process.env.redditClientId}:${process.env.redditSecret}`).toString(
				"base64",
			);
			const auth = `Basic ${encryptedAuth}`;

			const headers = {
				"User-Agent": "Entertainment-Hub by dedeco99",
				Authorization: auth,
			};

			const res = await api({ method: "post", url, headers });
			json = res.data;
			break;
		}
		case "twitch": {
			const url = `https://api.twitch.tv/kraken/oauth2/token?client_id=${process.env.twitchClientId}&client_secret=${process.env.twitchSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.redirect}/apps/twitch`;

			const res = await api({ method: "post", url });
			json = res.data;
			break;
		}
		case "youtube": {
			const url = `https://www.googleapis.com/oauth2/v4/token?client_id=${process.env.youtubeClientId}&client_secret=${process.env.youtubeSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.redirect}/apps/youtube`;

			const res = await api({ method: "post", url });
			json = res.data;
			break;
		}
		case "gmail": {
			const url = `https://www.googleapis.com/oauth2/v4/token?client_id=${process.env.youtubeClientId}&client_secret=${process.env.youtubeSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.redirect}/apps/gmail`;

			const res = await api({ method: "post", url });
			json = res.data;
			console.log(json);
			break;
		}
		default: {
			break;
		}
	}

	if (json.refresh_token) {
		const newApp = new App({ user: user._id, platform, refreshToken: json.refresh_token });
		await newApp.save();

		return response(201, "ADD_APP", newApp);
	} else if (platform === "tv") {
		const newApp = new App({ user: user._id, platform });
		await newApp.save();

		return response(201, "ADD_APP", newApp);
	}

	return errors.badRequest;
}

async function deleteApp(event) {
	const { params } = event;
	const { id } = params;

	let app = null;
	try {
		app = await App.findOneAndDelete({ _id: id });
	} catch (e) {
		return errors.notFound;
	}

	if (!app) return errors.notFound;

	return response(200, "DELETE_APP", app);
}

module.exports = {
	getApps,
	addApp,
	deleteApp,
};
