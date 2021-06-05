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

async function getPlaylistVideos(id, after) {
	const res = await api({
		method: "get",
		url: `/api/youtube/playlist/${id}${after ? `?after=${after}` : ""}`,
	});

	return res;
}

async function addToWatchLater(data) {
	const res = await api({
		method: "post",
		url: "/api/youtube/watchlater",
		data,
		message: true,
	});

	return res;
}

export { getSubscriptions, getVideos, getPlaylists, getPlaylistVideos, addToWatchLater };
