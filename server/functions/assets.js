const { response } = require("../utils/request");

const tv = require("../functions/tv");

const Asset = require("../models/asset");

async function getAsset(event) {
	const { params } = event;
	const { platform, externalId } = params;

	const asset = await Asset.findOne({ platform, externalId }).lean();

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
