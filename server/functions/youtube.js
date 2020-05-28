const { response, api } = require("../utils/request");
const errors = require("../utils/errors");
const { diff } = require("../utils/utils");

const { addNotifications } = require("./notifications");

const App = require("../models/app");
const Channel = require("../models/channel");

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

		if (!json.refresh_token) return errors.youtubeRefreshToken;

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

async function addToWatchLater(event) {
	const { params, user } = event;
	const { id } = params;

	const accessToken = await getAccessToken(user);

	const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=${process.env.youtubeKey}`;

	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	const body = {
		snippet: {
			playlistId: "WL",
			resourceId: {
				videoId: id,
				kind: "youtube#video",
			},
		},
	};

	const res = await api({ method: "post", url, data: body, headers });

	if (res.status === 409) return errors.duplicated;
	if (res.status === 403) return errors.youtubeForbidden;

	return response(200, "Video saved to watch later", true);
}

async function getChannelsPlaylist(channel) {
	const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channel}&maxResults=50&key=${process.env.youtubeKey}`;

	const res = await api({ method: "get", url });

	if (res.status === 403) return errors.youtubeForbidden;

	const json = res.data;

	return json.items;
}

async function cronjob(page = 0) {
	let hasMore = false;
	const notificationsToAdd = [];

	let channels = await Channel.aggregate([
		{
			$group: {
				_id: "$channelId",
				displayName: { $first: "$displayName" },
				users: { $push: "$user" },
			},
		},
		{ $sort: { _id: 1 } },
		{ $skip: page ? page * 50 : 0 },
	]);

	if (channels.length > 50) {
		hasMore = true;
		channels = channels.slice(0, 50);
	}

	const channelsString = channels.map(channel => channel._id).join(",");

	const playlists = await getChannelsPlaylist(channelsString);

	for (let i = 0; i < playlists.length; i++) {
		const playlist = playlists[i];

		const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlist.contentDetails.relatedPlaylists.uploads}&maxResults=3&key=${process.env.youtubeKey}`;

		const res = await api({ method: "get", url });

		const json = res.data;

		for (const video of json.items) {
			if (diff(video.snippet.publishedAt, "hours") <= 3) {
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

	if (hasMore) await cronjob(page + 1);

	return true;
}

module.exports = {
	getSubscriptions,
	addToWatchLater,
	cronjob,
};
