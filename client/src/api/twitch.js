import { api } from "../utils/request";

async function getStreams(after) {
	const res = await api({
		method: "get",
		url: `/api/twitch/streams${after ? `?after=${after}` : ""}`,
	});

	return res;
}

async function getFollows(after) {
	const res = await api({
		method: "get",
		url: `/api/twitch/follows${after ? `?after=${after}` : ""}`,
	});

	return res;
}

export { getStreams, getFollows };
