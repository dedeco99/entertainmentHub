const dayjs = require("dayjs");

const { response } = require("../utils/request");

const tv = require("../functions/tv");

const Asset = require("../models/asset");
const Episode = require("../models/episode");

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
	const assets = await Asset.find({ platform: "tv" }).lean();

	for (const asset of assets) {
		await new Promise(resolve => {
			setTimeout(async () => {
				await tv.updateAsset(asset);

				resolve();
			}, 3000);
		});
	}
}

module.exports = {
	getAsset,
	cronjob,
};
