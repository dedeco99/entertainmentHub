const { Schema, model } = require("mongoose");

const WidgetSchema = new Schema(
	{
		user: { type: Schema.ObjectId, ref: "User", required: true },
		type: { type: String, default: "", required: true },
		group: {
			name: { type: String },
		},
		x: { type: Number, default: 0 },
		y: { type: Number, default: 0 },
		width: { type: Number, default: null },
		height: { type: Number, default: null },
		info: {
			// Reddit
			subreddit: { type: String },
			search: { type: String },
			listView: { type: Boolean },

			// Weather
			city: { type: String },
			country: { type: String },
			lat: { type: Number },
			lon: { type: Number },

			// Crypto
			coins: { type: String },

			// Price
			productId: { type: String },
		},
	},
	{ timestamps: { createdAt: "_created", updatedAt: "_modified" } },
);

const Widget = model("Widget", WidgetSchema);

module.exports = Widget;
