const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WidgetSchema = new Schema({
	user: { type: Schema.ObjectId, ref: "User" },
	type: { type: String, default: "" },
	x: { type: Number, default: 0 },
	y: { type: Number, default: 0 },
	width: { type: Number, default: null },
	height: { type: Number, default: null },
	info: {
		// Reddit
		subreddit: { type: String },

		// Weather
		city: { type: String },
		country: { type: String },
		lat: { type: Number },
		lon: { type: Number },
	},
}, { timestamps: { createdAt: "_created", updatedAt: "_modified" } });

const Widget = mongoose.model("Widget", WidgetSchema);

module.exports = Widget;
