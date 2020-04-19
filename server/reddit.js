const sanitizeHtml = require("sanitize-html");

const { middleware, response } = require("./middleware");
const errors = require("./errors");
const { api } = require("./request");

const App = require("./models/app");

async function getAccessToken(user) {
	const app = await App.findOne({ user: user._id, platform: "reddit" }).lean();

	const url = `https://www.reddit.com/api/v1/access_token?refresh_token=${app.refreshToken}&grant_type=refresh_token`;

	const encryptedAuth = new Buffer.from(`${process.env.redditClientId}:${process.env.redditSecret}`).toString("base64");
	const auth = `Basic ${encryptedAuth}`;
	const headers = {
		"User-Agent": "Entertainment-Hub by dedeco99",
		Authorization: auth,
	};

	const res = await api({ method: "post", url, headers });

	if (res.status === 400) {
		await App.deleteOne({ user: user._id, platform: "reddit" });

		throw errors.redditRefreshToken;
	}

	const json = res.data;

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
			flairs: data.link_flair_richtext.map(flair => flair.t),
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

async function getSubreddits(req, res) {
	const data = { userId: req.query.userId };

	const accessToken = await getAccessToken(data);

	const url = "https://oauth.reddit.com/subreddits/mine/subscriber";
	const headers = {
		"User-Agent": "Entertainment-Hub by dedeco99",
		Authorization: `bearer ${accessToken}`,
	};

	try {
		const request = await api({ method: "get", url, headers });
		const json = JSON.parse(request);

		const subreddits = [];
		let all = "";
		for (let i = 0; i < json.data.children.length; i++) {
			let displayName = json.data.children[i].data.display_name;
			all += `${displayName}+`;
			displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
			const subreddit = {
				id: displayName,
				displayName,
			};
			subreddits.push(subreddit);
		}

		subreddits.sort((a, b) => {
			if (a.displayName < b.displayName) return -1;
			if (a.displayName > b.displayName) return 1;
			return 0;
		});

		const otherSubs = [
			{ id: "original", displayName: "Original" },
			{ id: "popular", displayName: "Popular" },
			{ id: "all", displayName: "All" },
			{ id: all, displayName: "Home" },
		];
		otherSubs.forEach(subreddit => {
			subreddits.unshift(subreddit);
		});

		res.json(subreddits);
	} catch (err) {
		res.json("Subreddit not found");
	}
}

async function getPosts(event) {
	const { params, user } = event;
	const { subreddit, category } = params;

	const data = { subreddit, category };

	const accessToken = await getAccessToken(user);

	let url = `https://oauth.reddit.com/r/${data.subreddit}/${data.category}`;
	if (data.after) url += `?after=${data.after}`;

	const headers = {
		"User-Agent": "Entertainment-Hub by dedeco99",
		Authorization: `bearer ${accessToken}`,
	};

	const res = await api({ method: "get", url, headers });

	if (res.status === 403) throw errors.redditForbidden;
	if (res.status === 404) throw errors.redditNotFound;

	const json = res.data;
	console.log(json.data.children[2]);
	const posts = formatResponse(json);

	return response(200, "Reddit posts found", posts);
}

module.exports = {
	getSubreddits: (req, res) => middleware(req, res, getSubreddits, ["token"]),
	getPosts: (req, res) => middleware(req, res, getPosts, ["token"]),
};
