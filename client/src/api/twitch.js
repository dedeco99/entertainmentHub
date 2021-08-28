import { api } from "../utils/request";

async function getStreams(after) {
	const res = await api({
		method: "get",
		url: `/api/twitch/streams${after ? `?after=${after}` : ""}`,
	});

	return res;
}

async function getFollows(after, type, filter) {
	let query = "";
	query += after ? `?after=${after}` : "";
	query += filter ? `${query ? "&" : "?"}filter=${filter}` : "";

	const res = await api({
		method: "get",
		url: `/api/twitch/follows/${type}${query}`,
	});

	return res;
}

async function getClips(id, type, after) {
	let query = "";
	query += type ? `?type=${type}` : "";
	query += after ? `${query ? "&" : "?"}after=${after}` : "";

	const res = await api({
		method: "get",
		url: `/api/twitch/clips/${id}${query}`,
	});

	return res;
}

export { getStreams, getFollows, getClips };
