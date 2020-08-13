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

	return response(200, "GET_FEEDS", feeds);
}

async function addFeed(event) {
	const { params, body, user } = event;
	const { platform } = params;
	const { displayName, subscriptions } = body;

	if (!displayName || !subscriptions || !subscriptions.length) return errors.requiredFieldsMissing;

	const feed = new Feed({
		user: user._id,
		platform,
		displayName,
		subscriptions,
	});

	await feed.save();

	return response(201, "ADD_FEEDS", feed);
}

async function editFeed(event) {
	const { params, body } = event;
	const { id } = params;
	const { displayName, subscriptions, x, y, width, height } = body;

	if (!displayName || !subscriptions || !subscriptions.length) return errors.requiredFieldsMissing;

	let feed = null;
	try {
		feed = await Feed.findOneAndUpdate(
			{ _id: id },
			{ displayName, subscriptions, x, y, width, height },
			{ new: true },
		);
	} catch (e) {
		return errors.notFound;
	}

	if (!feed) return errors.notFound;

	return response(200, "EDIT_FEEDS", feed);
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

	return response(200, "DELETE_FEEDS", feed);
}

module.exports = {
	getFeeds,
	addFeed,
	editFeed,
	deleteFeed,
};
