import { api } from "../utils/request";

async function getPosts(subreddit) {
	const res = await api({
		method: "get",
		url: `/api/reddit/${subreddit}/hot`,
	});

	return res;
}

async function getSearch(subreddit, search) {
	const res = await api({
		method: "get",
		url: `/api/reddit/${subreddit}/search/${search}`,
	});

	return res;
}

export {
	getPosts,
	getSearch,
};
