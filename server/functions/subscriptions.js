const dayjs = require("dayjs");

const { response } = require("../utils/request");
const errors = require("../utils/errors");
const { toObjectId, diff } = require("../utils/utils");

const tv = require("./tv");
const twitch = require("./twitch");

const Subscription = require("../models/subscription");
const Asset = require("../models/asset");
const Episode = require("../models/episode");

async function getSubscriptions(event) {
	const { params, query, user } = event;
	const { platform } = params;
	const { sortBy, group } = query;

	const page = Number(query.page) || 0;
	const perPage = Number(query.perPage) || 20;
	const sortDesc = query.sortDesc === "true";

	let sortQuery = { displayName: 1 };
	if (sortBy) sortQuery = { [sortBy]: sortDesc ? -1 : 1 };

	const searchQuery = { active: true, user: user._id, platform };

	if (group) searchQuery["group.name"] = group;

	const promises = await Promise.all([
		Subscription.aggregate([{ $match: searchQuery }, { $count: "total" }]),
		Subscription.aggregate([
			{ $match: searchQuery },
			{ $sort: sortQuery },
			{ $skip: page * perPage },
			{ $limit: perPage },
		]),
	]);

	const total = promises[0].length ? promises[0][0].total : 0;
	let subscriptions = promises[1];

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
		const assets = await Asset.find(
			{ externalId: { $in: subscriptions.map(i => i.externalId) } },
			"externalId contentType firstDate rating providers",
		).lean();

		subscriptions = subscriptions.map(s => {
			const asset = assets.find(a => a.externalId === s.externalId);

			if (!asset) return s;

			return {
				...s,
				hasAsset: true,
				year: dayjs(asset.firstDate).get("year"),
				rating: asset.rating,
				providers: asset.providers,
			};
		});

		tv.sendSocketUpdate("set", subscriptions, user);
	}

	return response(200, "GET_SUBSCRIPTIONS", { subscriptions, total });
}

async function getSubscriptionGroups(event) {
	const { params, user } = event;
	const { platform } = params;

	const groups = await Subscription.aggregate([
		{ $match: { active: true, user: user._id, platform } },
		{
			$group: {
				_id: "$group.name",
				name: { $first: "$group.name" },
				total: { $sum: 1 },
				pos: { $first: "$group.pos" },
			},
		},
		{ $sort: { pos: 1 } },
	]);

	return response(200, "GET_SUBSCRIPTION_GROUPS", groups);
}

async function orderSubscriptionGroups(event) {
	const { params, body, user } = event;

	const { platform } = params;

	for (let i = 0; i < body.length; i++) {
		const group = body[i];

		await Subscription.updateMany(
			{ user: user._id, platform, "group.name": group },
			{ "group.pos": i },
			{ new: true },
		);
	}

	const groups = await getSubscriptionGroups({ params: { platform }, user });

	return response(200, "ORDER_SUBSCRIPTION_GROUPS", groups.body.data);
}

// eslint-disable-next-line max-lines-per-function
async function addSubscriptions(event) {
	const { params, body, user } = event;
	const { platform } = params;
	const { subscriptions } = body;

	if (!subscriptions || !subscriptions.length) return errors.requiredFieldsMissing;

	const subscriptionsToAdd = [];
	const subscriptionsToReAdd = [];
	for (const subscription of subscriptions) {
		const { externalId, contentType, displayName, group, image, notifications } = subscription;

		if (externalId && displayName) {
			const subscriptionExists = await Subscription.findOne({ user: user._id, platform, externalId }).lean();

			if (!subscriptionExists) {
				subscriptionsToAdd.push(
					new Subscription({
						user: user._id,
						platform,
						contentType,
						externalId,
						displayName,
						group,
						image,
						notifications,
					}),
				);
			} else if (!subscriptionExists.active) {
				subscriptionsToReAdd.push(
					await Subscription.findOneAndUpdate(
						{ _id: subscriptionExists._id },
						{ active: true },
						{ new: true },
					).lean(),
				);
			}

			if (platform === "tv") {
				const assetExists = await Asset.findOne({ platform, externalId }).lean();

				if (!assetExists) {
					tv.addAsset(contentType, externalId);
					if (contentType === "tv") tv.fetchEpisodes({ _id: externalId, displayName }, user);
				}
			}
		}
	}

	try {
		await Subscription.insertMany(subscriptionsToAdd);
	} catch (err) {
		console.log(err);
	}

	const newSubscriptions = await Subscription.find({
		externalId: { $in: subscriptionsToAdd.map(s => s.externalId) },
		user,
	}).lean();
	let updatedSubscriptions = newSubscriptions.concat(subscriptionsToReAdd);

	if (platform === "tv") {
		// It's always just 1 series so it's not slow
		updatedSubscriptions = await tv.getEpisodeNumbers(
			updatedSubscriptions.map(s => ({ ...s, hasAsset: true })),
			user,
		);
	}

	return response(201, "ADD_SUBSCRIPTIONS", updatedSubscriptions);
}

async function editSubscription(event) {
	const { params, body } = event;
	const { id } = params;
	const { displayName, group, notifications } = body;

	let subscription = null;
	try {
		subscription = await Subscription.findOneAndUpdate(
			{ _id: id },
			{ displayName, group, notifications },
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

	if (watched) {
		if (watched === "all") {
			const episodes = await Episode.find({ seriesId: id });

			watched =
				subscription.contentType === "tv"
					? episodes.filter(e => e.date && diff(e.date) > 0).map(e => `S${e.season}E${e.number}`)
					: [true];
		}

		try {
			const updateQuery = markAsWatched
				? { $addToSet: { watched: { $each: watched.map(key => ({ key, date: Date.now() })) } } }
				: { $pull: { watched: { key: { $in: watched } } } };

			subscription = await Subscription.findOneAndUpdate(
				toObjectId(id) ? { _id: id } : { user: user._id, externalId: id },
				updateQuery,
				{ new: true },
			).lean();
		} catch (err) {
			return errors.notFound;
		}
	}

	if (!subscription) return errors.notFound;

	return response(200, "PATCH_SUBSCRIPTIONS", subscription);
}

async function deleteSubscription(event) {
	const { params, query } = event;
	const { id } = params;
	const { archive } = query;

	let subscription = null;
	try {
		subscription =
			archive === "true"
				? await Subscription.findOneAndUpdate({ _id: id }, { active: false })
				: await Subscription.findOneAndDelete({ _id: id });
	} catch (e) {
		return errors.notFound;
	}

	if (!subscription) return errors.notFound;

	return response(200, "DELETE_SUBSCRIPTIONS", subscription);
}

module.exports = {
	getSubscriptions,
	getSubscriptionGroups,
	orderSubscriptionGroups,
	addSubscriptions,
	editSubscription,
	patchSubscription,
	deleteSubscription,
};
