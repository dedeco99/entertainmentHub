const { response } = require("../utils/request");

const Asset = require("../models/asset");

async function getAsset(event) {
	const { params } = event;
	const { platform, externalId } = params;

	const asset = await Asset.findOne({ platform, externalId }).lean();

	return response(200, "GET_ASSET", asset);
}

module.exports = {
	getAsset,
};
