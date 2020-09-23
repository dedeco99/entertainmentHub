const rssParser = require("rss-converter");

const { response, api } = require("../utils/request");
const errors = require("../utils/errors");
const { diff } = require("../utils/utils");

const { addNotifications } = require("./notifications");

const App = require("../models/app");
const Subscription = require("../models/subscription");
const Notification = require("../models/notification");

async function getAccessToken(user) {
	const app = await App.findOne({ user: user._id, platform: "youtube" }).lean();

	if (!app) return errors.youtubeRefreshToken;

	const url = `https://www.googleapis.com/oauth2/v4/token?client_id=${process.env.youtubeClientId}&client_secret=${process.env.youtubeSecret}&refresh_token=${app.refreshToken}&grant_type=refresh_token`;

	const res = await api({ method: "post", url });
	const json = res.data;

	if (res.status === 400) {
		await App.deleteOne({ _id: app._id });

		return errors.youtubeRefreshToken;
	}

	return json.access_token;
}

async function getVideoDuration(items) {
	const requests = [];
	let remainingItems = items;

	while (remainingItems.length > 0) {
		const paginatedItems = remainingItems.slice(0, 50);
		remainingItems = remainingItems.slice(50, remainingItems.length);
		const videoIds = paginatedItems.map(i => i.yt_videoId);

		// prettier-ignore
		const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(",")}&key=${process.env.youtubeKey}`;

		requests.push(api({ method: "get", url }));
	}

	const responses = await Promise.all(requests);

	let videoDurationItems = [];
	for (const res of responses) {
		videoDurationItems = videoDurationItems.concat(res.data.items);
	}

	return videoDurationItems;
}

async function getSubscriptions(event) {
	const { params, query, user } = event;
	const { type } = params;
	const { filter, after } = query;

	const accessToken = await getAccessToken(user);

	if (accessToken.status === 401) return errors.youtubeRefreshToken;

	let url = null;
	switch (type) {
		case "mine":
			// prettier-ignore
			url =	"https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&order=alphabetical&maxResults=20";
			break;
		case "search":
			url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${filter}&maxResults=20`;
			break;
		default:
			// prettier-ignore
			url =	"https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&order=alphabetical&maxResults=20";
			break;
	}

	if (after) url += `&pageToken=${after}`;

	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	const res = await api({ method: "get", url, headers });
	const json = res.data;

	const channels = json.items.map(channel => ({
		externalId: channel.snippet.channelId,
		displayName: channel.snippet.title,
		image: channel.snippet.thumbnails.default.url,
		after: json.nextPageToken,
	}));

	return response(200, "GET_YOUTUBE_SUBSCRIPTIONS", channels);
}

async function getVideos(event) {
	const { params } = event;
	const { channels } = params;

	const requests = [];
	for (const channel of channels.split(",")) {
		const request = rssParser.toJson(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel}`);

		requests.push(request);
	}

	const responses = await Promise.all(requests);

	let items = [];
	for (const res of responses) {
		items = items.concat(res.items);
	}

	const videoDurationItems = await getVideoDuration(items);

	function calculateLikes(i) {
		return (
			i.media_group.media_community.media_starRating_count *
			(i.media_group.media_community.media_starRating_average / 5)
		);
	}

	items = items
		.map(i => ({
			published: i.published,
			displayName: i.author.name,
			thumbnail: i.media_group.media_thumbnail_url.replace("hqdefault", "mqdefault"),
			videoTitle: i.title,
			videoId: i.yt_videoId,
			channelId: i.yt_channelId,
			views: i.media_group.media_community.media_statistics_views,
			likes: Math.round(calculateLikes(i)),
			dislikes: Math.round(i.media_group.media_community.media_starRating_count - calculateLikes(i)),
			duration: videoDurationItems.find(v => v.id === i.yt_videoId).contentDetails.duration,
		}))
		.sort((a, b) => new Date(b.published) - new Date(a.published));

	return response(200, "GET_YOUTUBE_VIDEOS", items);
}

async function getPlaylists(event) {
	const { query, user } = event;
	const { after } = query;

	const accessToken = await getAccessToken(user);

	if (accessToken.status === 401) return errors.youtubeRefreshToken;

	// prettier-ignore
	let url = "https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&order=alphabetical&maxResults=20";
	if (after) url += `&pageToken=${after}`;

	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	const res = await api({ method: "get", url, headers });
	const json = res.data;

	const playlists = json.items.map(playlist => ({
		externalId: playlist.id,
		displayName: playlist.snippet.title,
		image: playlist.snippet.thumbnails.default.url,
		after: json.nextPageToken,
	}));

	return response(200, "GET_YOUTUBE_SUBSCRIPTIONS", playlists);
}

async function getPlaylistVideos(event) {
	const { params, query, user } = event;
	const { id } = params;
	const { after } = query;

	const accessToken = await getAccessToken(user);

	if (accessToken.status === 401) return errors.youtubeRefreshToken;

	// prettier-ignore
	let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&maxResults=20`;
	if (after) url += `&pageToken=${after}`;

	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	const res = await api({ method: "get", url, headers });
	const json = res.data;

	const videos = json.items.map(video => ({
		externalId: video.id,
		displayName: video.snippet.title,
		image: video.snippet.thumbnails.default.url,
		after: json.nextPageToken,
	}));

	return response(200, "GET_PLAYLIST_VIDEOS", videos);
}

async function addToWatchLater(event) {
	const { body, user } = event;
	const { videos } = body;

	if (!user.settings.youtube.watchLaterPlaylist) return errors.requiredFieldsMissing;

	const accessToken = await getAccessToken(user);

	if (accessToken.status === 401) return errors.youtubeRefreshToken;

	const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=${process.env.youtubeKey}`;

	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	const notificationsToHide = [];
	for (const video of videos) {
		const data = {
			snippet: {
				playlistId: user.settings.youtube.watchLaterPlaylist,
				resourceId: {
					videoId: video.videoId,
					kind: "youtube#video",
				},
			},
		};

		await api({ method: "post", url, data, headers });

		/*
		if (res.status === 409) return errors.duplicated;
		if (res.status === 403) return errors.youtubeForbidden;
		*/

		notificationsToHide.push(video._id);
	}

	await Notification.updateMany({ _id: { $in: notificationsToHide } }, { active: false });

	const updatedNotifications = await Notification.find({ _id: { $in: notificationsToHide } }).lean();

	return response(200, "WATCH_LATER", updatedNotifications);
}

async function cronjob() {
	const subscriptions = await Subscription.aggregate([
		{ $match: { platform: "youtube" } },
		{
			$group: {
				_id: "$externalId",
				displayName: { $first: "$displayName" },
				users: { $push: "$user" },
			},
		},
		{ $sort: { _id: 1 } },
	]);

	const requests = [];
	for (const subscription of subscriptions) {
		const request = rssParser.toJson(`https://www.youtube.com/feeds/videos.xml?channel_id=${subscription._id}`);

		requests.push(request);
	}

	const responses = await Promise.all(requests);

	let items = [];
	for (const res of responses) {
		items = items.concat(res.items.filter(i => diff(i.published, "hours") <= 3));
	}

	const videoDurationItems = await getVideoDuration(items);

	const notificationsToAdd = [];
	for (const video of items) {
		const notifications = [];
		const subscription = subscriptions.find(c => c._id === video.yt_channelId);
		const videoDurationItem = videoDurationItems.find(v => v.id === video.yt_videoId);

		if (subscription) {
			for (const user of subscription.users) {
				notifications.push({
					dateToSend: video.published,
					sent: true,
					notificationId: `${user}${video.yt_videoId}`,
					user,
					type: "youtube",
					info: {
						displayName: video.author.name,
						thumbnail: video.media_group.media_thumbnail_url.replace("hqdefault", "mqdefault"),
						duration: videoDurationItem.contentDetails.duration,
						videoTitle: video.title,
						videoId: video.yt_videoId,
						channelId: video.yt_channelId,
					},
				});
			}
		}

		notificationsToAdd.push(addNotifications(notifications));
	}

	if (notificationsToAdd.length) await Promise.all(notificationsToAdd);

	return true;
}

module.exports = {
	getSubscriptions,
	getVideos,
	getPlaylists,
	getPlaylistVideos,
	addToWatchLater,
	cronjob,
};
