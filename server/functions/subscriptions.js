const { response } = require("../utils/request");
const errors = require("../utils/errors");

const tv = require("./tv");

const Subscription = require("../models/subscription");

async function getSubscriptions(event) {
	const { params, user } = event;
	const { platform } = params;

	const subscriptions = await Subscription.find({ user: user._id, platform })
		.collation({ locale: "en" })
		.sort({ displayName: 1 })
		.lean();

	return response(200, "GET_SUBSCRIPTIONS", subscriptions);
}

async function addSubscriptions(event) {
	const { params, body, user } = event;
	const { platform } = params;
	const { subscriptions } = body;

	if (!subscriptions || !subscriptions.length) return errors.requiredFieldsMissing;

	const subscriptionsToAdd = [];
	for (const subscription of subscriptions) {
		const { externalId, displayName, image } = subscription;

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
					}),
				);

				if (platform === "tv") {
					const seriesPopulated = await Subscription.findOne({ platform, externalId }).lean();

					if (!seriesPopulated) {
						await tv.fetchEpisodes({
							_id: externalId,
							displayNames: [displayName],
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
	const { displayName } = body;

	let subscription = null;
	try {
		subscription = await Subscription.findOneAndUpdate({ _id: id }, { displayName }, { new: true }).lean();
	} catch (err) {
		return errors.notFound;
	}

	if (!subscription) return errors.notFound;

	return response(200, "EDIT_SUBSCRIPTIONS", subscription);
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
	deleteSubscription,
};
