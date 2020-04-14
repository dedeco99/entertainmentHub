import { api } from "../utils/request";

async function getPosts(subreddit) {
	const res = await api({
		method: "get",
		url: `api/reddit/subreddits/${subreddit}/hot`,
	});

	return res;
}

export {
	getPosts,
};
