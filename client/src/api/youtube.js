import { api } from "../utils/request";

async function getSubscriptions() {
	const res = await api({
		method: "get",
		url: "api/youtube/subscriptions",
	});

	return res;
}

async function getChannels() {
	const res = await api({
		method: "get",
		url: "api/youtube/channels",
	});

	return res;
}

async function addChannels(channels) {
	const res = await api({
		method: "post",
		url: "api/youtube/channels",
		data: channels,
		message: true,
	});

	return res;
}

async function deleteChannel(id) {
	const res = await api({
		method: "delete",
		url: `api/youtube/channels/${id}`,
		message: true,
	});

	return res;
}

export {
	getSubscriptions,
	getChannels,
	addChannels,
	deleteChannel,
};
