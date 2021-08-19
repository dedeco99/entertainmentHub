const { response, api } = require("../utils/request");
const errors = require("../utils/errors");

const dayjs = require("dayjs");

const App = require("../models/app");
const Subscription = require("../models/subscription");

async function getAccessToken(user, grantType) {
	const app = await App.findOne({ user: user._id, platform: "twitch" }).lean();

	if (!app) return errors.twitchRefreshToken;

	const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.twitchClientId}&client_secret=${process.env.twitchSecret}&refresh_token=${app.refreshToken}&grant_type=${grantType}`;

	const res = await api({ method: "post", url });
	const json = res.data;

	if (res.status === 400) {
		await App.deleteOne({ _id: app._id });

		return errors.twitchRefreshToken;
	}

	return json.access_token;
}

async function getStreams(event) {
	const { query, user } = event;
	const { after, skipGame } = query;

	const subscriptions = await Subscription.find({ active: true, user: user._id, platform: "twitch" }).lean();

	if (!subscriptions.length) return response(200, "No streams found", []);

	const subscriptionsString = `user_id=${subscriptions.map(s => s.externalId).join("&user_id=")}`;

	const accessToken = await getAccessToken(user, "client_credentials");

	if (accessToken.status === 401) return errors.twitchRefreshToken;

	let url = `https://api.twitch.tv/helix/streams?${subscriptionsString}`;
	if (after) url += `&after=${after}`;

	const headers = {
		"Client-ID": process.env.twitchClientId,
		Authorization: `Bearer ${accessToken}`,
	};

	let res = await api({ method: "get", url, headers });
	let json = res.data;

	let streams = json.data.map(stream => ({
		id: stream.id,
		live: true,
		user: stream.user_name,
		title: stream.title,
		thumbnail: stream.thumbnail_url.replace("{width}x{height}", "640x360"),
		game: stream.game_id,
		viewers: stream.viewer_count,
		dateStarted: stream.started_at,
		after: json.pagination.cursor,
	}));

	if (!skipGame) {
		const gamesString = `id=${streams.map(s => s.game).join("&id=")}`;

		url = `https://api.twitch.tv/helix/games?${gamesString}`;

		res = await api({ method: "get", url, headers });
		json = res.data;

		streams = streams.map(stream => {
			const game = json.data.find(g => g.id === stream.game);

			return {
				...stream,
				game: game && game.name,
			};
		});
	}

	streams.sort((a, b) => (a.viewers <= b.viewers ? 1 : -1));

	return response(200, "GET_STREAMS", streams);
}

async function getFollows(event) {
	const { query, user } = event;
	const { after } = query;

	const accessToken = await getAccessToken(user, "refresh_token");

	if (accessToken.status === 401) return errors.twitchRefreshToken;

	const headers = {
		"Client-ID": process.env.twitchClientId,
		Authorization: `Bearer ${accessToken}`,
	};

	let url = "https://api.twitch.tv/helix/users";

	let res = await api({ method: "get", url, headers });
	let json = res.data;

	url = `https://api.twitch.tv/helix/users/follows?from_id=${json.data[0].id}`;
	if (after) url += `&after=${after}`;

	res = await api({ method: "get", url, headers });
	json = res.data;

	let channels = json.data.map(follow => ({
		externalId: follow.to_id,
		displayName: follow.to_name,
		after: json.pagination.cursor,
	}));

	if (channels.length) {
		const channelsString = `id=${channels.map(c => c.externalId).join("&id=")}`;

		url = `https://api.twitch.tv/helix/users?${channelsString}`;

		res = await api({ method: "get", url, headers });
		json = res.data;

		channels = channels
			.map(follow => {
				const channel = json.data.find(c => c.id === follow.externalId);

				return {
					...follow,
					image: channel && channel.profile_image_url,
				};
			})
			.sort((a, b) => (a.displayName.toLowerCase() <= b.displayName.toLowerCase() ? -1 : 1));
	}

	return response(200, "GET_CHANNELS", channels);
}

async function getSearch(event) {
	const { query, user } = event;
	const { filter, after } = query;

	const accessToken = await getAccessToken(user, "refresh_token");

	if (accessToken.status === 401) return errors.twitchRefreshToken;

	const headers = {
		"Client-ID": process.env.twitchClientId,
		Authorization: `Bearer ${accessToken}`,
	};

	let url = `https://api.twitch.tv/helix/search/channels?query=${filter}`;
	if (after) url += `&after=${after}`;

	const res = await api({ method: "get", url, headers });
	const json = res.data;

	const channels = json.data.map(follow => ({
		externalId: follow.id,
		displayName: follow.display_name,
		image: follow.thumbnail_url,
		after: json.pagination.cursor,
	}));

	return response(200, "GET_CHANNELS", channels);
}

async function getClips(event) {
	const { params, query, user } = event;
	const { id } = params;
	const { type, after } = query;

	const accessToken = await getAccessToken(user, "client_credentials");

	if (accessToken.status === 401) return errors.twitchRefreshToken;

	let url = `https://api.twitch.tv/helix/${type}?${type === "clips" ? "broadcaster_id" : "user_id"}=${id}`;
	if (after) url += `&after=${after}`;

	const headers = {
		"Client-ID": process.env.twitchClientId,
		Authorization: `Bearer ${accessToken}`,
	};

	const res = await api({ method: "get", url, headers });
	const json = res.data;

	const clips = json.data.map(clip => ({
		published: dayjs(clip.published_at || clip.created_at).toDate(),
		displayName: clip.user_name || clip.broadcaster_name,
		thumbnail: clip.thumbnail_url.replace("%{width}", "640").replace("%{height}", "360"),
		videoTitle: clip.title,
		videoId: clip.id,
		channelId: clip.user_id || clip.broadcaster_id,
		views: clip.view_count,
		duration: isNaN(clip.duration) ? clip.duration : `${clip.duration.toFixed()}s`,
		after: json.pagination.cursor,
	}));

	console.log(clips);

	return response(200, "GET_CLIPS", clips);
}

async function testWebhooks(accessToken) {
	let url = "https://api.twitch.tv/helix/webhooks/hub";

	let headers = {
		"Client-ID": process.env.twitchClientId,
		Authorization: `Bearer ${accessToken}`,
	};

	const body = {
		"hub.callback": "http://localhost:3000/api/twitch/webhooks",
		"hub.mode": "subscribe",
		"hub.topic": "https://api.twitch.tv/helix/streams?user_id=5678",
		"hub.lease_seconds": 864000,
	};

	let res = await api({ method: "post", url, data: body, headers });
	let json = res.data;

	console.log(res);

	url = "https://api.twitch.tv/helix/webhooks/subscriptions?first=10";

	headers = {
		"Client-ID": process.env.twitchClientId,
		Authorization: `Bearer ${accessToken}`,
	};

	res = await api({ method: "get", url, headers });
	json = res.data;

	console.log(json);
}

module.exports = {
	getStreams,
	getFollows,
	getSearch,
	getClips,
};
