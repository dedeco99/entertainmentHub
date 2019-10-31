const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EpisodeSchema = new Schema({
	seriesId: { type: String, default: null },
	title: { type: String, default: "" },
	image: { type: String, default: "" },
	season: { type: String, default: null },
	number: { type: String, default: null },
	date: { type: String, default: null },
});

const Episode = mongoose.model("Episode", EpisodeSchema);

module.exports = Episode;