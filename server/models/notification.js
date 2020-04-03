const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
	active: { type: Boolean, default: true },
	user: { type: Schema.ObjectId, ref: "User" },
	type: { type: String, default: "" },
	message: { type: String, default: "" },
}, { timestamps: { createdAt: "_created", updatedAt: "_modified" } });

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
