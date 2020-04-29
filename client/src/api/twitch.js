import { api } from "../utils/request";

async function getStreams(after) {
	const res = await api({
		method: "get",
		url: `api/twitch/streams${after ? `?after=${after}` : ""}`,
	});

	return res;
}

async function getFollows(after) {
	const res = await api({
		method: "get",
		url: `api/twitch/follows${after ? `?after=${after}` : ""}`,
	});

	return res;
}

async function getChannels() {
	const res = await api({
		method: "get",
		url: "api/twitch/channels",
	});

	return res;
}

async function addChannels(channels) {
	const res = await api({
		method: "post",
		url: "api/twitch/channels",
		data: { channels },
		message: true,
	});

	return res;
}

async function deleteChannel(id) {
	const res = await api({
		method: "delete",
		url: `api/twitch/channels/${id}`,
		message: true,
	});

	return res;
}

export {
	getStreams,
	getFollows,
	getChannels,
	addChannels,
	deleteChannel,
};
