const { Schema, model } = require("mongoose");

const ScheduledNotificationSchema = new Schema(
	{
		active: { type: Boolean, default: true },
		sent: { type: Boolean, default: false },
		dateToSend: { type: Date, required: true },
		notificationId: { type: String, unique: true },
		user: { type: Schema.ObjectId, ref: "User" },
		type: { type: String, required: true },
		info: {
			// TV
			seriesId: { type: String },
			season: { type: Number },
			number: { type: Number },

			// Reminder
			reminder: { type: String },
		},
	},
	{ timestamps: { createdAt: "_created", updatedAt: "_modified" } },
);

const ScheduledNotification = model("ScheduledNotification", ScheduledNotificationSchema);

module.exports = ScheduledNotification;
