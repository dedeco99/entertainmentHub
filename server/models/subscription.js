const { Schema, model } = require("mongoose");

const SubscriptionSchema = new Schema(
	{
		active: { type: Boolean, default: true },
		user: { type: Schema.ObjectId, ref: "User", required: true },
		platform: { type: String, required: true },
		group: {
			name: { type: String },
			pos: { type: Number },
		},
		externalId: { type: String, default: "", required: true },
		displayName: { type: String, default: "", required: true },
		image: { type: String, default: "" },
		notifications: {
			active: { type: Boolean, default: true },
			priority: { type: Number, default: 0 },

			rules: [
				{
					if: { type: Object },
					then: { type: Object },
				},
			],

			// youtube
			autoAddToWatchLater: { type: Boolean, default: false },
			watchLaterPlaylist: { type: String },
		},
		watched: [
			{
				key: { type: String },
				date: { type: Date },
			},
		],
	},
	{ timestamps: { createdAt: "_created", updatedAt: "_modified" } },
);

const Subscription = model("Subscription", SubscriptionSchema);

module.exports = Subscription;
