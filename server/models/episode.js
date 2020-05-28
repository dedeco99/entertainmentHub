const { Schema, model } = require("mongoose");

const EpisodeSchema = new Schema({
	seriesId: { type: String, default: null },
	title: { type: String, default: "" },
	image: { type: String, default: "" },
	season: { type: Number, default: null },
	number: { type: Number, default: null },
	date: { type: Date, default: null },
}, { timestamps: { createdAt: "_created", updatedAt: "_modified" } });

const Episode = model("Episode", EpisodeSchema);

module.exports = Episode;
