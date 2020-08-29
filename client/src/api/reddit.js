import { api } from "../utils/request";

async function getSubreddits(after, type, filter) {
	let query = "";
	query += after ? `?after=${after}` : "";
	query += filter ? `${query ? "&" : "?"}filter=${filter}` : "";

	const res = await api({
		method: "get",
		url: `/api/reddit/subreddits/${type}${query}`,
	});

	return res;
}

async function getPosts(subreddit, filter = "hot", after) {
	const res = await api({
		method: "get",
		url: `/api/reddit/${subreddit}/${filter}${after ? `?after=${after}` : ""}`,
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
