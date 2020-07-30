const { response } = require("../utils/request");
const errors = require("../utils/errors");

const Feed = require("../models/feed");

async function getFeeds(event) {
	const { params, user } = event;
	const { platform } = params;

	const feeds = await Feed.find({ user: user._id, platform })
		.collation({ locale: "en" })
		.sort({ displayName: 1 })
		.lean();

	return response(200, "Channel groups found", feeds);
}

async function addFeed(event) {
	const { params, body, user } = event;
	const { platform } = params;
	const { displayName, channels } = body;

	if (!displayName || !channels || !channels.length) return errors.requiredFieldsMissing;

	const feed = new Feed({
		user: user._id,
		platform,
		displayName,
		channels,
	});

	await feed.save();

	return response(201, "Channel group created", feed);
}

async function editFeed(event) {
	const { params, body } = event;
	const { id } = params;
	const { displayName, channels, x, y, width, height } = body;

	if (!displayName || !channels || !channels.length) return errors.requiredFieldsMissing;

	let feed = null;
	try {
		feed = await Feed.findOneAndUpdate({ _id: id }, { displayName, channels, x, y, width, height }, { new: true });
	} catch (e) {
		return errors.notFound;
	}

	if (!feed) return errors.notFound;

	return response(200, "Channel group updated", feed);
}

async function deleteFeed(event) {
	const { params } = event;
	const { id } = params;

	let feed = null;
	try {
		feed = await Feed.findOneAndDelete({ _id: id });
	} catch (e) {
		return errors.notFound;
	}

	if (!feed) return errors.notFound;

	return response(200, "Channel group deleted", feed);
}

module.exports = {
	getFeeds,
	addFeed,
	editFeed,
	deleteFeed,
};
