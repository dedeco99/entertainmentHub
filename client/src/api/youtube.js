import { api } from "../utils/request";

async function getSubscriptions(after) {
	const res = await api({
		method: "get",
		url: `/api/youtube/subscriptions${after ? `?after=${after}` : ""}`,
	});

	return res;
}

async function getVideos(channels) {
	const res = await api({
		method: "get",
		url: `/api/youtube/videos/${channels}`,
	});

	return res;
}

async function addToWatchLater(id) {
	const res = await api({
		method: "post",
		url: `/api/youtube/watchlater/${id}`,
		message: true,
	});

	return res;
}

export { getSubscriptions, getVideos, addToWatchLater };
