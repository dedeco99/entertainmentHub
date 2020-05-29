const { response } = require("../utils/request");
const errors = require("../utils/errors");

const Channel = require("../models/channel");

async function getChannels(event) {
	const { params, user } = event;
	const { platform } = params;

	const channels = await Channel.find({ user: user._id, platform })
		.collation({ locale: "en" }).sort({ displayName: 1 }).lean();

	return response(200, "Channels found", channels);
}

async function addChannels(event) {
	const { params, body, user } = event;
	const { platform } = params;
	const { channels } = body;

	if (!channels || !channels.length) return errors.requiredFieldsMissing;

	const channelsToAdd = [];
	for (const channel of channels) {
		const { channelId, displayName, image } = channel;

		if (channelId && displayName) {
			const channelExists = await Channel.findOne({ user: user._id, platform, channelId }).lean();

			if (!channelExists) {
				channelsToAdd.push(new Channel({
					user: user._id,
					platform,
					channelId,
					displayName,
					image,
				}));
			}
		}
	}

	await Channel.insertMany(channelsToAdd);

	return response(200, "Channels created", channelsToAdd);
}

async function deleteChannel(event) {
	const { params } = event;
	const { id } = params;

	let channel = null;
	try {
		channel = await Channel.findOneAndDelete({ _id: id });
	} catch (e) {
		return errors.notFound;
	}

	if (!channel) return errors.notFound;

	return response(200, "Channel deleted", channel);
}

module.exports = {
	getChannels,
	addChannels,
	deleteChannel,
};
