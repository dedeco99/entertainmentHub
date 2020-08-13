const sanitizeHtml = require("sanitize-html");

const { response, api } = require("../utils/request");
const errors = require("../utils/errors");

const App = require("../models/app");

async function getAccessToken(user) {
	const app = await App.findOne({ user: user._id, platform: "reddit" }).lean();

	if (!app) return errors.redditRefreshToken;

	const url = `https://www.reddit.com/api/v1/access_token?refresh_token=${app.refreshToken}&grant_type=refresh_token`;

	const encryptedAuth = new Buffer.from(`${process.env.redditClientId}:${process.env.redditSecret}`).toString(
		"base64",
	);
	const auth = `Basic ${encryptedAuth}`;
	const headers = {
		"User-Agent": "Entertainment-Hub by dedeco99",
		Authorization: auth,
	};

	const res = await api({ method: "post", url, headers });
	const json = res.data;

	if (res.status === 400) {
		await App.deleteOne({ _id: app._id });

		return errors.redditRefreshToken;
	}

	return json.access_token;
}

function formatResponse(json) {
	const res = [];
	for (let i = 0; i < json.data.children.length; i++) {
		const data = json.data.children[i].data;

		let redditVideo = null;
		if (data.media && data.media.reddit_video) {
			redditVideo = data.media.reddit_video.fallback_url;
		}

		let videoHeight = null;
		let videoPreview = null;
		if (data.media && data.media.oembed) {
			videoHeight = data.media.oembed.height;
		} else if (data.preview && data.preview.images && data.preview.images[0].resolutions) {
			const resolutions = data.preview.images[0].resolutions;
			if (resolutions[resolutions.length - 1]) {
				videoPreview = resolutions[resolutions.length - 1].url;
			}
		}

		res.push({
			id: data.id,
			title: data.title,
			subreddit: data.subreddit,
			permalink: `https://reddit.com/${data.permalink}`,
			gilded: data.gilded,
			score: data.score,
			comments: data.num_comments,
			crossposts: data.num_crossposts,
			flairs: data.link_flair_richtext.map(flair => flair.t).filter(flair => flair),
			author: data.author,
			stickied: data.stickied,
			domain: data.domain,
			url: data.url,
			thumbnail: data.thumbnail,
			text: sanitizeHtml(data.selftext_html),
			redditVideo,
			videoHeight,
			videoPreview,
			created: data.created_utc,
			after: json.data.after,
		});
	}
	return res;
}

async function isSubreddit(subreddit, user) {
	const accessToken = await getAccessToken(user);

	if (accessToken.status === 401) return errors.redditRefreshToken;

	const url = `https://oauth.reddit.com/api/search_reddit_names?query=${subreddit}&exact=true`;

	const headers = {
		"User-Agent": "Entertainment-Hub by dedeco99",
		Authorization: `bearer ${accessToken}`,
	};

	const res = await api({ method: "get", url, headers });

	return res.status !== 404;
}

async function getSubreddits(event) {
	const { query, user } = event;
	const { filter, after } = query;

	const accessToken = await getAccessToken(user);

	if (accessToken.status === 401) return errors.redditRefreshToken;

	let url = "https://oauth.reddit.com/subreddits/mine/subscriber";
	if (after) url += `?after=${after}`;

	if (filter) {
		url = `https://oauth.reddit.com/subreddits/search?q=${filter}`;
	}

	const headers = {
		"User-Agent": "Entertainment-Hub by dedeco99",
		Authorization: `bearer ${accessToken}`,
	};

	const res = await api({ method: "get", url, headers });
	const json = res.data;

	const subreddits = json.data.children.map(subreddit => ({
		displayName: subreddit.data.display_name,
		subscribers: subreddit.data.subscribers,
		nsfw: subreddit.data.over18,
		created: subreddit.data.created,
		after: json.after,
	}));

	if (!filter) {
		subreddits.sort((a, b) => (a.displayName.toLowerCase() <= b.displayName.toLowerCase() ? -1 : 1));
	}

	return response(200, "GET_SUBREDDITS", subreddits);
}

async function getPosts(event) {
	const { params, query, user } = event;
	const { subreddit, category } = params;
	const { after } = query;

	const accessToken = await getAccessToken(user);

	if (accessToken.status === 401) return errors.redditRefreshToken;

	let url = `https://oauth.reddit.com/r/${subreddit}/${category}`;
	if (after) url += `?after=${after}`;

	const headers = {
		"User-Agent": "Entertainment-Hub by dedeco99",
		Authorization: `bearer ${accessToken}`,
	};

	const res = await api({ method: "get", url, headers });

	if (res.status === 403) return errors.redditForbidden;
	if (res.status === 404) return errors.redditNotFound;

	const json = res.data;
	const posts = formatResponse(json);

	return response(200, "GET_REDDIT_POSTS", posts);
}

async function getSearch(event) {
	const { params, query, user } = event;
	const { subreddit, search } = params;
	const { after } = query;

	const accessToken = await getAccessToken(user);

	if (accessToken.status === 401) return errors.redditRefreshToken;

	let url = `https://oauth.reddit.com/r/${subreddit}/search?q=${search}&restrict_sr=1&type=link&sort=new`;
	if (after) url += `&after=${after}`;

	const headers = {
		"User-Agent": "Entertainment-Hub by dedeco99",
		Authorization: `bearer ${accessToken}`,
	};

	const res = await api({ method: "get", url, headers });

	if (res.status === 403) return errors.redditForbidden;
	if (res.status === 404) return errors.redditNotFound;

	const json = res.data;
	const posts = formatResponse(json);

	return response(200, "GET_REDDIT_SEARCH", posts);
}

module.exports = {
	isSubreddit,
	getSubreddits,
	getPosts,
	getSearch,
};
