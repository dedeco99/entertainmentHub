import { api } from "../utils/request";

async function getChannels(platform) {
	const res = await api({
		method: "get",
		url: `api/channels/${platform}`,
	});

	return res;
}

async function addChannels(platform, channels) {
	const res = await api({
		method: "post",
		url: `api/channels/${platform}`,
		data: { channels },
		message: true,
	});

	return res;
}

async function deleteChannel(id) {
	const res = await api({
		method: "delete",
		url: `api/channels/${id}`,
		message: true,
	});

	return res;
}

export {
	getChannels,
	addChannels,
	deleteChannel,
};
