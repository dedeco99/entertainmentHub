import { api } from "../utils/request";

async function getChannelsGroup(platform) {
	const res = await api({
		method: "get",
		url: `api/channelgroups/${platform}`,
	});

	return res;
}

async function addChannelsGroup(platform, displayName, channels) {
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
	getChannelsGroup,
	addChannelsGroup,
	deleteChannelGroup,
};
