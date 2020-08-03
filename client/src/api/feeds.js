import { api } from "../utils/request";

async function getFeeds(platform) {
	const res = await api({
		method: "get",
		url: `/api/feeds/${platform}`,
	});

	return res;
}

async function addFeed(platform, displayName, subscriptions) {
	const res = await api({
		method: "post",
		url: `/api/feeds/${platform}`,
		data: { displayName, subscriptions },
		message: true,
	});

	return res;
}

async function editFeed(feed) {
	const res = await api({
		method: "put",
		url: `/api/feeds/${feed._id}`,
		data: feed,
	});

	return res;
}

async function deleteFeed(id) {
	const res = await api({
		method: "delete",
		url: `/api/feeds/${id}`,
		message: true,
	});

	return res;
}

export { getFeeds, addFeed, editFeed, deleteFeed };
