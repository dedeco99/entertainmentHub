const { response, api } = require("../utils/request");
const errors = require("../utils/errors");

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
	const { after } = query;

	const subscriptions = await Subscription.find({ user: user._id, platform: "twitch" }).lean();

	if (!subscriptions.length) return response(200, "No streams found", []);

	const subscriptionsString = `user_id=${subscriptions.map(c => c.externalId).join("&user_id=")}`;

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

	streams.sort((a, b) => (a.viewers <= b.viewers ? 1 : -1));

	return response(200, "Streams found", streams);
}

async function getFollows(event) {
	const { query, user } = event;
	const { after } = query;

	const accessToken = await getAccessToken(user, "refresh_token");

	if (accessToken.status === 401) return errors.twitchRefreshToken;

	let url = "https://api.twitch.tv/helix/users";

	const headers = {
		"Client-ID": process.env.twitchClientId,
		Authorization: `Bearer ${accessToken}`,
	};

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

	return response(200, "Twitch followed channels found", channels);
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
};
