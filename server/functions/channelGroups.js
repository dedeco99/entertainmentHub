const { response } = require("../utils/request");
const errors = require("../utils/errors");

const ChannelGroup = require("../models/channelGroup");

async function getChannelGroups(event) {
	const { params, user } = event;
	const { platform } = params;

	const channelGroups = await ChannelGroup.find({ user: user._id, platform })
		.collation({ locale: "en" }).sort({ displayName: 1 }).lean();

	return response(200, "Channel groups found", channelGroups);
}

async function addChannelGroup(event) {
	const { params, body, user } = event;
	const { platform } = params;
	const { displayName, channels } = body;

	if (!displayName || !channels || !channels.length) return errors.requiredFieldsMissing;

	const channelGroup = new ChannelGroup({
		user: user._id,
		platform,
		displayName,
		channels,
	});

	await channelGroup.save();

	return response(201, "Channel group created", channelGroup);
}

async function editChannelGroup(event) {
	const { params, body } = event;
	const { id } = params;
	const { displayName, channels } = body;

	if (!displayName || !channels || !channels.length) return errors.requiredFieldsMissing;

	let channelGroup = null;
	try {
		channelGroup = await ChannelGroup.findOneAndUpdate({ _id: id }, { displayName, channels }, { new: true });
	} catch (e) {
		return errors.notFound;
	}

	if (!channelGroup) return errors.notFound;

	return response(200, "Channel group updated", channelGroup);
}

async function deleteChannelGroup(event) {
	const { params } = event;
	const { id } = params;

	let channelGroup = null;
	try {
		channelGroup = await ChannelGroup.findOneAndDelete({ _id: id });
	} catch (e) {
		return errors.notFound;
	}

	if (!channelGroup) return errors.notFound;

	return response(200, "Channel group deleted", channelGroup);
}

module.exports = {
	getChannelGroups,
	addChannelGroup,
	editChannelGroup,
	deleteChannelGroup,
};
