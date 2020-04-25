const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ScheduledNotificationSchema = new Schema({
	active: { type: Boolean, default: true },
	sent: { type: Boolean, default: false },
	dateToSend: { type: Date, required: true },
	notificationId: { type: String, unique: true, required: true },
	type: { type: String, required: true },
	info: {
		// TV
		seriesId: { type: String },
		season: { type: Number },
		number: { type: Number },
	},
}, { timestamps: { createdAt: "_created", updatedAt: "_modified" } });

const ScheduledNotification = mongoose.model("ScheduledNotification", ScheduledNotificationSchema);

module.exports = ScheduledNotification;
