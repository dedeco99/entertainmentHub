const { response } = require("../utils/request");
const errors = require("../utils/errors");
const { toObjectId } = require("../utils/utils");

const tv = require("./tv");
const twitch = require("./twitch");

const Subscription = require("../models/subscription");
const Episode = require("../models/episode");

async function getSubscriptions(event) {
	const { params, user } = event;
	const { platform } = params;

	let subscriptions = await Subscription.find({ user: user._id, platform })
		.collation({ locale: "en" })
		.sort({ displayName: 1 })
		.lean();

	if (platform === "twitch") {
		const streams = await twitch.getStreams({ user, query: { skipGame: true } });

		subscriptions = subscriptions.map(subscription => {
			const stream = streams.body.data.find(s => s.user === subscription.displayName);

			if (stream) {
				return {
					...subscription,
					viewers: stream.viewers,
					online: stream.live,
				};
			}

			return subscription;
		});
	} else if (platform === "tv") {
		subscriptions = await tv.getEpisodeNumbers(subscriptions, user);
	}

	return response(200, "GET_SUBSCRIPTIONS", subscriptions);
}

async function addSubscriptions(event) {
	const { params, body, user } = event;
	const { platform } = params;
	const { subscriptions } = body;

	if (!subscriptions || !subscriptions.length) return errors.requiredFieldsMissing;

	const subscriptionsToAdd = [];
	for (const subscription of subscriptions) {
		const { externalId, displayName, image, notifications } = subscription;

		if (externalId && displayName) {
			const subscriptionExists = await Subscription.findOne({ user: user._id, platform, externalId }).lean();

			if (!subscriptionExists) {
				subscriptionsToAdd.push(
					new Subscription({
						user: user._id,
						platform,
						externalId,
						displayName,
						image,
						notifications,
					}),
				);

				if (platform === "tv") {
					const seriesPopulated = await Subscription.findOne({ platform, externalId }).lean();

					if (!seriesPopulated) {
						tv.fetchEpisodes({
							_id: externalId,
							displayName,
							users: [user._id],
						});
					}
				}
			}
		}
	}

	await Subscription.insertMany(subscriptionsToAdd);

	return response(201, "ADD_SUBSCRIPTIONS", subscriptionsToAdd);
}

async function editSubscription(event) {
	const { params, body } = event;
	const { id } = params;
	const { displayName, notifications } = body;

	let subscription = null;
	try {
		subscription = await Subscription.findOneAndUpdate(
			{ _id: id },
			{ displayName, notifications },
			{ new: true },
		).lean();
	} catch (err) {
		return errors.notFound;
	}

	if (!subscription) return errors.notFound;

	return response(200, "EDIT_SUBSCRIPTIONS", subscription);
}

async function patchSubscription(event) {
	const { params, body, user } = event;
	const { id } = params;
	const { markAsWatched } = body;
	let { watched } = body;

	let subscription = await Subscription.findOne(
		toObjectId(id) ? { _id: id } : { user: user._id, externalId: id },
	).lean();

	if (watched === "all") {
		const episodes = await Episode.find({ seriesId: id });

		watched = episodes.map(e => `S${e.season}E${e.number}`);
	}

	try {
		const updateQuery = markAsWatched
			? { $addToSet: { watched: { $each: watched.map(key => ({ key, date: Date.now() })) } } }
			: { $pull: { watched: { key: { $in: watched } } } };

		subscription = await Subscription.findOneAndUpdate(
			toObjectId(id) ? { _id: id } : { user: user._id, externalId: id },
			updateQuery,
			{ new: true },
		);
	} catch (err) {
		return errors.notFound;
	}

	if (!subscription) return errors.notFound;

	return response(200, "PATCH_SUBSCRIPTIONS", subscription);
}

async function deleteSubscription(event) {
	const { params } = event;
	const { id } = params;

	let subscription = null;
	try {
		subscription = await Subscription.findOneAndDelete({ _id: id });
	} catch (e) {
		return errors.notFound;
	}

	if (!subscription) return errors.notFound;

	return response(200, "DELETE_SUBSCRIPTIONS", subscription);
}

module.exports = {
	getSubscriptions,
	addSubscriptions,
	editSubscription,
	patchSubscription,
	deleteSubscription,
};
