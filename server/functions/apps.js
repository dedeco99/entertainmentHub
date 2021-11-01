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
	const userApps = await App.find({ user: user._id });

	if (userApps.find(a => a.platform === platform)) return errors.duplicated;

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
			break;
		}
		default: {
			break;
		}
	}

	let newApp = null;
	if (json.refresh_token) {
		newApp = new App({ user: user._id, platform, refreshToken: json.refresh_token, pos: userApps.length });
		await newApp.save();
	} else if (["tv", "reminders"].includes(platform)) {
		newApp = new App({ user: user._id, platform, pos: userApps.length });
		await newApp.save();
	} else {
		return errors.badRequest;
	}

	return response(201, "ADD_APP", { ...JSON.parse(JSON.stringify(newApp)), refreshToken: null });
}

async function patchApp(event) {
	const { params, body, user } = event;
	const { id } = params;
	const { pos } = body;

	let app = null;
	try {
		app = await App.findOne({ _id: id });
	} catch (e) {
		return errors.notFound;
	}

	if (!app) return errors.notFound;

	try {
		await Promise.all([
			App.updateMany(
				{
					user: user._id,
					_id: { $ne: id },
					pos: { $gte: app.pos, $lte: pos },
				},
				{ $inc: { pos: -1 } },
			),
			App.updateMany(
				{
					user: user._id,
					_id: { $ne: id },
					pos: { $gte: pos, $lte: app.pos },
				},
				{ $inc: { pos: 1 } },
			),
			App.updateOne({ _id: id }, { pos }, { new: true }),
		]);
	} catch (e) {
		return errors.notFound;
	}

	return response(200, "PATCH_APP");
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
	patchApp,
	deleteApp,
};
