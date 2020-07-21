import { api } from "../utils/request";

async function getChannelGroups(platform) {
	const res = await api({
		method: "get",
		url: `api/channelgroups/${platform}`,
	});

	return res;
}

async function addChannelGroup(platform, displayName, channels) {
	const res = await api({
		method: "post",
		url: `api/channelgroups/${platform}`,
		data: { displayName, channels },
		message: true,
	});

	return res;
}

async function deleteChannelGroup(id) {
	const res = await api({
		method: "delete",
		url: `api/channelgroups/${id}`,
		message: true,
	});

	return res;
}

export {
	getChannelGroups,
	addChannelGroup,
	deleteChannelGroup,
};
