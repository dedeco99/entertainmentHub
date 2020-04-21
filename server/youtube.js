const { middleware, response } = require("./middleware");
const errors = require("./errors");
const { api } = require("./request");

const Channel = require("./models/channel");
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

	let url = "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=25";
	if (after) url += `&pageToken=${after}`;

	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	const res = await api({ method: "get", url, headers });
	const json = res.data;

	const channels = json.items.map(channel => ({
		channelId: channel.snippet.resourceId.channelId,
		displayName: channel.snippet.title,
		logo: channel.snippet.thumbnails.default.url,
		after: json.nextPageToken,
	}));

	return response(200, "Youtube subscriptions found", channels);
}

async function getChannels(event) {
	const { user } = event;

	const channels = await Channel.find({ user: user._id }).lean();

	return response(200, "Channels found", channels);
}

async function addChannels(event) {
	const { body, user } = event;
	const { channels } = body;

	if (!channels || !channels.length) return errors.requiredFieldsMissing;

	const channelsToAdd = [];
	for (const channel of channels) {
		const { channelId, displayName, image } = channel;

		if (channelId && displayName) {
			channelsToAdd.push(new Channel({
				user: user._id,
				channelId,
				displayName,
				image,
			}));
		}
	}

	await Channel.insertMany(channelsToAdd);

	return response(200, "Channels created", channels);
}

async function deleteChannel(event) {
	const { params } = event;
	const { id } = params;

	let channel = null;
	try {
		channel = await Channel.findOneAndDelete({ _id: id });
	} catch (e) {
		return errors.notFound;
	}

	if (!channel) return errors.notFound;

	return response(200, "Channel deleted", channel);
}

module.exports = {
	getSubscriptions: (req, res) => middleware(req, res, getSubscriptions, ["token"]),
	getChannels: (req, res) => middleware(req, res, getChannels, ["token"]),
	addChannels: (req, res) => middleware(req, res, addChannels, ["token"]),
	deleteChannel: (req, res) => middleware(req, res, deleteChannel, ["token"]),
};
