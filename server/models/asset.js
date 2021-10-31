const { Schema, model } = require("mongoose");

const AssetSchema = new Schema(
	{
		platform: { type: String, required: true },
		externalId: { type: String, default: "", required: true },
		displayName: { type: String, default: "", required: true },
		image: { type: String, default: "" },

		// tv
		genres: [
			{
				externalId: { type: Number },
				name: { type: String },
			},
		],
		firstDate: { type: Date },
		lastDate: { type: Date },
		status: { type: String },
		episodeRunTime: { type: Number, default: null },
		tagline: { type: String },
		overview: { type: String },
		rating: { type: Number, default: null },
		languages: [{ type: String }],
		backdrops: [{ type: String }],
		providers: [
			{
				url: { type: String },
				icon: { type: String },
			},
		],
		imdbId: { type: String },
	},
	{ timestamps: { createdAt: "_created", updatedAt: "_modified" } },
);

const Asset = model("Asset", AssetSchema);

module.exports = Asset;
