import { api } from "../utils/request";

async function getStreams(after) {
	const res = await api({
		method: "get",
		url: `api/twitch/streams${after ? `?after=${after}` : ""}`,
	});

	return res;
}

export {
	getStreams,
};
