const dayjs = require("dayjs");

const { response } = require("../utils/request");

const tv = require("../functions/tv");

const Asset = require("../models/asset");
const Episode = require("../models/episode");
const Subscription = require("../models/subscription");

async function getAsset(event) {
	const { params, user } = event;
	const { platform, externalId } = params;

	const promises = [Asset.findOne({ platform, externalId }).lean()];

	if (platform === "tv") {
		promises.push(
			Episode.aggregate([
				{ $match: { seriesId: externalId } },
				{ $group: { _id: "$season" } },
				{ $sort: { _id: 1 } },
			]),
		);
		promises.push(
			Episode.aggregate([
				{ $match: { seriesId: externalId, date: { $lte: dayjs().toDate() } } },
				{ $sort: { season: -1, number: -1 } },
				{ $limit: 3 },
				...tv.watchedQuery(user),
				...tv.finaleQuery,
			]),
		);
	}

	const result = await Promise.all(promises);
	const asset = result[0] || {};

	if (platform === "tv") {
		asset.seasons = result[1].map(s => s._id);
		asset.latestEpisodes = result[2];
	}

	return response(200, "GET_ASSET", asset);
}

async function cronjob() {
	const assets = await Asset.find({
		platform: "tv",
		$or: [{ lastUpdate: null }, { lastUpdate: { $lte: dayjs().subtract(3, "days") } }],
	})
		.sort({ displayName: 1 })
		.lean();

	for (const asset of assets) {
		await new Promise(resolve => {
			setTimeout(async () => {
				await tv.updateAsset(asset);

				resolve();
			}, 3000);
		});
	}

	const subscriptions = await Subscription.aggregate([
		{ $match: { active: true, platform: "tv" } },
		{
			$group: {
				_id: "$externalId",
				displayName: { $first: "$displayName" },
				contentType: { $addToSet: "$contentType" },
			},
		},
		{ $sort: { displayName: 1 } },
	]);

	for (const series of subscriptions) {
		for (const contentType of series.contentType) {
			const assetExists = await Asset.findOne({ contentType, externalId: series._id });

			if (!assetExists) {
				await new Promise(resolve => {
					setTimeout(async () => {
						await tv.addAsset(contentType, series._id);

						resolve();
					}, 3000);
				});
			}
		}
	}
}

module.exports = {
	getAsset,
	cronjob,
};
