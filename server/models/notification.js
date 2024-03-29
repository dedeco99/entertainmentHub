const { Schema, model } = require("mongoose");

const NotificationSchema = new Schema(
	{
		active: { type: Boolean, default: true },
		dateToSend: { type: Date, required: true },
		notificationId: { type: String, unique: true, required: true },
		subscription: { type: Schema.ObjectId, ref: "Subscription", required: true },
		user: { type: Schema.ObjectId, ref: "User", required: true },
		type: { type: String, required: true },
		priority: { type: Number, default: 0 },
		topPriority: { type: Boolean, default: false },
		info: {
			displayName: { type: String },
			thumbnail: { type: String },
			duration: { type: String },

			// TV
			season: { type: Number },
			number: { type: Number },
			episodeTitle: { type: String },

			// Youtube
			videoTitle: { type: String },
			videoId: { type: String },
			channelId: { type: String },
			scheduled: { type: String },

			// Reminder
			reminder: { type: String },
		},
	},
	{ timestamps: { createdAt: "_created", updatedAt: "_modified" } },
);

const Notification = model("Notification", NotificationSchema);

module.exports = Notification;
