const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
	active: { type: Boolean, default: true },
	sent: { type: Boolean, default: false },
	dateToSend: { type: Date },
	notificationId: { type: String, unique: true },
	user: { type: Schema.ObjectId, ref: "User" },
	type: { type: String, default: "" },
	info: {
		displayName: { type: String },

		// TV
		season: { type: Number },
		number: { type: Number },

		// Youtube
		videoTitle: { type: String },
		videoId: { type: String },
	},
}, { timestamps: { createdAt: "_created", updatedAt: "_modified" } });

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
