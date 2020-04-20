const { middleware, response } = require("./middleware");
const errors = require("./errors");
const { api } = require("./request");

// const Channel = require("./models/channel");
const App = require("./models/app");

async function getAccessToken(user) {
	const app = await App.findOne({ user: user._id, platform: "youtube" }).lean();

	if (!app) return errors.notFound;

	let url = `https://www.googleapis.com/oauth2/v4/token?client_id=${process.env.youtubeClientId}&client_secret=${process.env.youtubeSecret}&refresh_token=${app.refreshToken}&grant_type=refresh_token`;

	let res = await api({ method: "post", url });
	let json = res.data;

	if (res.status === 400) {
		url = `https://www.googleapis.com/oauth2/v4/token?client_id=${process.env.youtubeClientId}&client_secret=${process.env.youtubeSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.redirect}/apps/youtube`;

		res = await api({ method: "post", url });
		json = res.data;

		if (!json.refresh_token) throw errors.youtubeRefreshToken;

		await App.updateOne({ user: user._id, platform: "youtube" }, { refreshToken: json.refresh_token });
	}

	return json.access_token;
}

async function getSubscriptions(event) {
	const { query, user } = event;
	const { after } = query;

	const accessToken = await getAccessToken(user);

	let url = "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50";
	if (after) url += `&pageToken=${after}`;

	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	const res = await api({ method: "get", url, headers });
	const json = res.data;

	const channels = json.items.map(channel => ({
		channelId: channel.snippet.resourceId.channelId,
		displayName: channel.snippet.title,
		logo: channel.snippet.thumbnails.high.url,
		after: json.nextPageToken,
	}));

	return response(200, "Youtube subscriptions found", channels);
}

module.exports = {
	getSubscriptions: (req, res) => middleware(req, res, getSubscriptions, ["token"]),
};
