const { middleware, response } = require("./utils/middleware");
const errors = require("./utils/errors");
const { api } = require("./utils/request");
const { addNotifications } = require("./notifications");

const App = require("./models/app");
const Channel = require("./models/channel");

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
			const channelExists = await Channel.findOne({ user: user._id, channelId }).lean();

			if (!channelExists) {
				channelsToAdd.push(new Channel({
					user: user._id,
					channelId,
					displayName,
					image,
				}));
			}
		}
	}

	await Channel.insertMany(channelsToAdd);

	return response(200, "Channels created", channelsToAdd);
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

async function getChannelsPlaylist(channel) {
	const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channel}&maxResults=50&key=${process.env.youtubeKey}`;

	const res = await api({ method: "get", url });

	if (res.status === 403) throw errors.youtubeForbidden;

	const json = res.data;

	return json.items;
}

async function cronjob() {
	const notificationsToAdd = [];
	const THREE_HOURS = 60000 * 60 * 3;

	const channels = await Channel.aggregate([
		{
			$group: {
				_id: "$channelId",
				displayName: { $first: "$displayName" },
				users: { $push: "$user" },
			},
		},
		{ $sort: { _id: 1 } },
	]);

	const channelsString = channels.map(channel => channel._id).join(",");

	const playlists = await getChannelsPlaylist(channelsString);

	for (let i = 0; i < playlists.length; i++) {
		const playlist = playlists[i];

		const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlist.contentDetails.relatedPlaylists.uploads}&maxResults=3&key=${process.env.youtubeKey}`;

		const res = await api({ method: "get", url });

		const json = res.data;

		for (const video of json.items) {
			// TODO: change to moment diff
			if (new Date() - new Date(video.snippet.publishedAt) < THREE_HOURS) {
				const notifications = [];
				for (const user of channels[i].users) {
					notifications.push({
						dateToSend: video.snippet.publishedAt,
						sent: true,
						notificationId: `${user}${video.snippet.resourceId.videoId}`,
						user,
						type: "youtube",
						info: {
							displayName: video.snippet.channelTitle,
							videoTitle: video.snippet.title,
							videoId: video.snippet.resourceId.videoId,
						},
					});
				}

				notificationsToAdd.push(addNotifications(notifications));
			}
		}
	}


	if (notificationsToAdd.length) await Promise.all(notificationsToAdd);

	return true;
}

module.exports = {
	getSubscriptions: (req, res) => middleware(req, res, getSubscriptions, ["token"]),
	getChannels: (req, res) => middleware(req, res, getChannels, ["token"]),
	addChannels: (req, res) => middleware(req, res, addChannels, ["token"]),
	deleteChannel: (req, res) => middleware(req, res, deleteChannel, ["token"]),
	cronjob,
};
