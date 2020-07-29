import { api } from "../utils/request";

async function getSubreddits(filter) {
	const query = filter ? `?filter=${filter}` : "";

	const res = await api({
		method: "get",
		url: `/api/reddit/subreddits${query}`,
	});

	return res;
}

async function getPosts(subreddit, after) {
	const res = await api({
		method: "get",
		url: `/api/reddit/${subreddit}/hot${after ? `?after=${after}` : ""}`,
	});

	return res;
}

async function getSearch(subreddit, search, after) {
	const res = await api({
		method: "get",
		url: `/api/reddit/${subreddit}/search/${search}${after ? `?after=${after}` : ""}`,
	});

	return res;
}

export { getSubreddits, getPosts, getSearch };
