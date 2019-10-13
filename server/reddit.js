/*const sanitizeHtml = require("sanitize-html");

const { getAuth } = require("./database");
const { get, post } = require("./request");

const getAccessToken = async (data) => {
	//const refreshToken = await getAuth({ "user": data.userId, "platform": "reddit" });
	const refreshToken = "24696451-vM4LoYxP9EZxiRnTi55zvFe-iPQ";

	const url = `https://www.reddit.com/api/v1/access_token
		?refresh_token=${refreshToken}&grant_type=refresh_token`.replace(/\t/g, "").replace(/\n/g, "");

	const encryptedAuth = new Buffer.from(`${process.env.redditClientId}:${process.env.redditSecret}`).toString("base64");
	const auth = `Basic ${encryptedAuth}`;
	const headers = {
		"User-Agent": "Entertainment-Hub by dedeco99",
		"Authorization": auth
	};

	const res = await post(url, headers);
	const json = JSON.parse(res);

	return json.access_token;
};

const getRefreshToken = async () => {
	const url = `https://www.reddit.com/api/v1/access_token
		?code=16U7Amy5y6j83dwUfmCILGVTuyM&grant_type=authorization_code&redirect_uri=http://localhost:5000/lul`.replace(/\t/g, "").replace(/\n/g, "");

	const encryptedAuth = new Buffer.from(`${process.env.redditClientId}:${process.env.redditSecret}`).toString("base64");
	const auth = `Basic ${encryptedAuth}`;

	const headers = {
		"User-Agent": "Entertainment-Hub by dedeco99",
		"Authorization": auth
	};

	const res = await post(url, headers);
	const json = JSON.parse(res);

	console.log(json);
};

const formatResponse = (json) => {
	const res = [];
	for (let i = 0; i < json.data.children.length; i++) {
		const data = json.data.children[i].data;

		if (data.thumbnail == "self" || data.thumbnail == "default") {
			isText = true;
		}

		let redditVideo = null;
		if (data.media && data.media.reddit_video) {
			redditVideo = data.media.reddit_video.fallback_url;
		}

		let videoHeight = null, videoPreview = null;
		if (data.media && data.media.oembed) {
			videoHeight = data.media.oembed.height;
		} else if (data.preview && data.preview.images && data.preview.images[0].resolutions) {
			const resolutions = data.preview.images[0].resolutions;
			if (resolutions[resolutions.length - 1]) {
				videoPreview = resolutions[resolutions.length - 1].url;
			}
		}

		res.push({
			id: i,
			title: data.title,
			permalink: `https://reddit.com/${data.permalink}`,
			thumbnail: data.thumbnail,
			upvotes: data.ups,
			downvotes: data.downs,
			comments: data.num_comments,
			crossposts: data.num_crossposts,
			author: data.author,
			domain: data.domain,
			url: data.url,
			text: sanitizeHtml(data.selftext_html),
			redditVideo: redditVideo,
			videoHeight: videoHeight,
			videoPreview: videoPreview,
			created: data.created,
			after: json.data.after
		});
	}
	return res;
};

const getSubreddits = async (req, res) => {
	const data = { userId: req.query.userId };

	const accessToken = await getAccessToken(data);

	const url = "https://oauth.reddit.com/subreddits/mine/subscriber?limit=1000";
	const headers = {
		"User-Agent": "Entertainment-Hub by dedeco99",
		"Authorization": `bearer ${accessToken}`
	};

	try {
		const request = await get(url, headers);
		const json = JSON.parse(request);

		const response = [];
		let all = "";
		for (let i = 0; i < json.data.children.length; i++) {
			let displayName = json.data.children[i].data.display_name;
			all += `${displayName}+`;
			displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
			const subreddit = {
				id: displayName,
				displayName: displayName
			};
			response.push(subreddit);
		}

		response.sort((a, b) => {
			if (a.displayName < b.displayName) return -1;
			if (a.displayName > b.displayName) return 1;
			return 0;
		});

		const otherSubs = [
			{ id: "original", displayName: "Original" },
			{ id: "popular", displayName: "Popular" },
			{ id: "all", displayName: "All" },
			{ id: all, displayName: "Home" }
		];
		otherSubs.forEach(subreddit => {
			response.unshift(subreddit);
		});

		res.json(response);
	} catch (err) {
		res.json("Subreddit not found");
	}
};

const getPosts = async (req, res) => {
	const data = {
		subreddit: req.params.subreddit,
		category: req.params.category,
		userId: req.query.userId
	};

	const accessToken = await getAccessToken(data);

	let url = `https://oauth.reddit.com/r/${data.subreddit}/${data.category}`;
	if (data.after) url += `?after=${data.after}`;

	const headers = {
		"User-Agent": "Entertainment-Hub by dedeco99",
		"Authorization": `bearer ${accessToken}`
	};

	try {
		const res = await get(url, headers);
		const json = JSON.parse(res);
		const response = formatResponse(json);

		res.json(response);
	} catch (err) {
		console.log(err);
		res.json("Subreddit not found");
	}
};

module.exports = {
	getSubreddits,
	getPosts
};
*/
