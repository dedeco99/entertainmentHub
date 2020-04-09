import { get } from "../utils/request";

async function getPosts(subreddit) {
	const res = await get(`api/reddit/subreddits/${subreddit}/hot`);

	return res;
}

export {
	getPosts,
};
