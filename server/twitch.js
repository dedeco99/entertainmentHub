const { middleware, response } = require("./utils/middleware");
const errors = require("./utils/errors");
const { api } = require("./utils/request");

const App = require("./models/app");

async function getAccessToken(user, grantType) {
	const app = await App.findOne({ user: user._id, platform: "twitch" }).lean();

	if (!app) return errors.notFound;

	const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.twitchClientId}&client_secret=${process.env.twitchSecret}&refresh_token=${app.refreshToken}&grant_type=${grantType}`;

	const res = await api({ method: "post", url });
	const json = res.data;

	return json.access_token;
}

async function getStreams(event) {
	const { query, user } = event;
	const { after } = query;

	const accessToken = await getAccessToken(user, "client_credentials");

	let url = "https://api.twitch.tv/helix/streams?user_login=esl_csgo&user_login=p4wnyhof&user_login=cohhcarnage";
	if (after) url += `&after=${after}`;

	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	const res = await api({ method: "get", url, headers });
	const json = res.data;

	const streams = json.data.map(stream => ({
		id: stream.id,
		live: true,
		user: stream.user_name,
		title: stream.title,
		game: stream.game_id,
		viewers: stream.viewer_count,
		dateStarted: stream.started_at,
		after: json.pagination.cursor,
	}));

	streams.sort((a, b) => a.viewers <= b.viewers ? 1 : -1);

	return response(200, "Streams found", streams);
}

async function getFollows(event) {
	const { query, user } = event;
	const { after } = query;

	const accessToken = await getAccessToken(user, "refresh_token");

	let url = "https://api.twitch.tv/helix/users";

	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	let res = await api({ method: "get", url, headers });
	let json = res.data;

	url = `https://api.twitch.tv/helix/users/follows?from_id=${json.data[0].id}`;
	if (after) url += `&after=${after}`;

	res = await api({ method: "get", url, headers });
	json = res.data;

	const channels = json.data.map(follow => ({
		channelId: follow.to_id,
		displayName: follow.to_name,
		after: json.pagination.cursor,
	}));

	return response(200, "Twitch followed channels found", channels);
}

async function testWebhooks(accessToken) {
	let url = "https://api.twitch.tv/helix/webhooks/hub";

	let headers = {
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
		Authorization: `Bearer ${accessToken}`,
	};

	res = await api({ method: "get", url, headers });
	json = res.data;

	console.log(json);
}

module.exports = {
	getStreams: (req, res) => middleware(req, res, getStreams, ["token"]),
	getFollows: (req, res) => middleware(req, res, getFollows, ["token"]),
};
