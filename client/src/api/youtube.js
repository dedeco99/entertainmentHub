import { api } from "../utils/request";

async function getSubscriptions(after, type, filter) {
	let query = "";
	query += after ? `?after=${after}` : "";
	query += filter ? `${query ? "&" : "?"}filter=${filter}` : "";

	const res = await api({
		method: "get",
		url: `/api/youtube/subscriptions/${type}${query}`,
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

async function getPlaylists(after) {
	const res = await api({
		method: "get",
		url: `/api/youtube/playlists${after ? `?after=${after}` : ""}`,
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

export { getSubscriptions, getVideos, getPlaylists, addToWatchLater };
