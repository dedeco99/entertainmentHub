const { Schema, model } = require("mongoose");

const SeriesSchema = new Schema({
	user: { type: Schema.ObjectId, ref: "User" },
	seriesId: { type: String, default: null },
	displayName: { type: String, default: "" },
	image: { type: String, default: "" },
}, { timestamps: { createdAt: "_created", updatedAt: "_modified" } });

const Series = model("Series", SeriesSchema);

module.exports = Series;
