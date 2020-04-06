import { get } from "../utils/request";

async function getPosts() {
	const res = await get("api/reddit/subreddits/MechanicalKeyboards/hot");

	return res;
}

export {
	getPosts,
};
