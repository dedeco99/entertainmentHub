const sanitizeHtml = require("sanitize-html");
const { extract } = require("@extractus/article-extractor");

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

// eslint-disable-next-line complexity
function formatResponse(json) {
	const res = [];
	for (let i = 0; i < json.data.children.length; i++) {
		const data = json.data.children[i].data;

		if (data.crosspost_parent_list) {
			data.media = data.crosspost_parent_list[0].media;
		}

		let redditVideo = null;
		if (data.media && data.media.reddit_video) {
			redditVideo = data.media.reddit_video.dash_url;
		} else if (data.preview && data.preview.reddit_video_preview) {
			data.url = data.preview.reddit_video_preview.fallback_url;
		}

		let videoHeight = null;
		let videoPreview = null;
		let gallery = null;
		if (data.media && data.media.oembed) {
			videoHeight = data.media.oembed.height;
		} else if (data.preview && data.preview.images && data.preview.images[0].resolutions) {
			const resolutions = data.preview.images[0].resolutions;
			if (resolutions[resolutions.length - 1]) {
				videoPreview = resolutions[resolutions.length - 1].url.replace(/amp;/g, "");
			}
		} else if (data.url.includes("https://www.reddit.com/gallery")) {
			gallery = [];
			for (const image of data.gallery_data.items) {
				if (data.media_metadata[image.media_id].s.u) {
					gallery.push({
						caption: image.caption,
						image: data.media_metadata[image.media_id].s.u.replace(/amp;/g, ""),
					});
				} else if (data.media_metadata[image.media_id].s.gif) {
					gallery.push({
						caption: image.caption,
						image: data.media_metadata[image.media_id].s.gif.replace(/amp;/g, ""),
					});
				}
			}
		}

		res.push({
			id: data.id,
			title: data.title,
			subreddit: data.subreddit,
			permalink: `https://reddit.com${data.permalink}`,
			gilded: data.gilded,
			score: data.score,
			comments: data.num_comments,
			crossposts: data.num_crossposts,
			flairs: data.link_flair_richtext.map(flair => flair.t || flair.u).filter(flair => flair.trim()),
			author: data.author,
			stickied: data.stickied,
			domain: data.domain,
			url: data.url,
			thumbnail: data.thumbnail,
			text: data.selftext_html ? sanitizeHtml(data.selftext_html) : null,
			gallery,
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
	const { params, query, user } = event;
	const { type } = params;
	const { filter, after } = query;

	const accessToken = await getAccessToken(user);

	if (accessToken.status === 401) return errors.redditRefreshToken;

	let url = null;
	switch (type) {
		case "mine":
			url = "https://oauth.reddit.com/subreddits/mine/subscriber?limit=20";
			break;
		case "search":
			url = `https://oauth.reddit.com/subreddits/search?q=${filter}&limit=20`;
			break;
		case "popular":
			url = "https://oauth.reddit.com/subreddits/popular?limit=20";
			break;
		default:
			url = "https://oauth.reddit.com/subreddits/mine/subscriber?limit=20";
			break;
	}

	if (after) url += `&after=${after}`;

	const headers = {
		"User-Agent": "Entertainment-Hub by dedeco99",
		Authorization: `bearer ${accessToken}`,
	};

	const res = await api({ method: "get", url, headers });
	const json = res.data;

	const subreddits = json.data.children.map(subreddit => ({
		externalId: subreddit.data.display_name,
		displayName: subreddit.data.display_name,
		image: subreddit.data.icon_img || subreddit.data.community_icon.split("?")[0],
		subscribers: subreddit.data.subscribers,
		isSubscribed: subreddit.data.user_is_subscriber,
		nsfw: subreddit.data.over18,
		created: subreddit.data.created,
		after: json.data.after,
	}));

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

async function getComments(event) {
	const { params, user } = event;
	const { subreddit, post } = params;

	const accessToken = await getAccessToken(user);

	if (accessToken.status === 401) return errors.redditRefreshToken;

	const url = `https://oauth.reddit.com/r/${subreddit}/comments/${post}?depth=2&limit=50&sort=confidence`;

	const headers = {
		"User-Agent": "Entertainment-Hub by dedeco99",
		Authorization: `bearer ${accessToken}`,
	};

	const res = await api({ method: "get", url, headers });

	if (res.status === 403) return errors.redditForbidden;
	if (res.status === 404) return errors.redditNotFound;

	const json = res.data;

	const comments = [];

	for (const comment of json[1].data.children.filter(r => r.kind === "t1")) {
		const data = comment.data;

		let media = null;
		if (data.media_metadata) {
			media = {};

			for (const id in data.media_metadata) {
				media[id] =
					data.media_metadata[id].t === "giphy"
						? `https://i.giphy.com/media/${id.split("|")[1]}/giphy.webp`
						: data.media_metadata[id].e === "Image"
						? data.media_metadata[id].s.u.replaceAll("&amp;", "&")
						: data.media_metadata[id].s.gif;
			}
		}

		const formattedComment = {
			id: data.id,
			author: data.author,
			isFromOP: data.is_submitter,
			score: data.score,
			gilded: data.gilded,
			text: data.body,
			media,
			edited: data.edited,
			created: data.created_utc,
		};

		if (data.replies) {
			formattedComment.replies = data.replies.data.children
				.filter(r => r.kind === "t1")
				.map(r => {
					let media = null;
					if (r.data.media_metadata) {
						media = {};

						for (const id in r.data.media_metadata) {
							media[id] =
								r.data.media_metadata[id].t === "giphy"
									? `https://i.giphy.com/media/${id.split("|")[1]}/giphy.webp`
									: r.data.media_metadata[id].s.gif;
						}
					}

					return {
						id: r.data.id,
						author: r.data.author,
						isFromOP: r.data.is_submitter,
						score: r.data.score,
						gilded: r.data.gilded,
						text: r.data.body,
						media,
						edited: r.data.edited,
						created: r.data.created_utc,
					};
				});
		}

		comments.push(formattedComment);
	}

	return response(200, "GET_REDDIT_COMMENTS", comments);
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

async function getHtmlFromUrl(event) {
	const { body } = event;
	const { url } = body;

	const res = await extract(url);

	return response(200, "GET_HTML_FROM_URL", { html: res ? res.content : null });
}

module.exports = {
	isSubreddit,
	getSubreddits,
	getPosts,
	getComments,
	getSearch,
	getHtmlFromUrl,
};
