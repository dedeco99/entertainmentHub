/* global sockets */

const { middleware, response } = require("./utils");
const errors = require("./errors");

const Notification = require("./models/notification");

async function getNotifications(event) {
	const { user } = event;

	const notifications = await Notification.find(
		{ user: user._id, active: true },
	).sort({ _created: -1 }).lean();

	return response(200, "Notifications found", notifications);
}

async function patchNotification(event) {
	const { params } = event;
	const { id } = params;

	console.log("here", id);

	let notification = null;
	try {
		notification = await Notification.findOneAndUpdate(
			{ _id: id },
			{ active: false },
			{ new: true },
		);
	} catch (e) {
		throw errors.notFound;
	}

	if (!notification) throw errors.notFound;

	return response(200, "Notification updated", notification);
}

async function sendNotifications(notifications) {
	for (const notification of notifications) {
		const { user, type, message } = notification;
		const notificationExists = await Notification.findOne({ user, type, message }).lean();

		if (!notificationExists) {
			const newNotification = new Notification({ user, type, message });
			newNotification.save();

			for (const socket of sockets[user]) {
				socket.emit("notification", { type, message });
			}
		}
	}
}

module.exports = {
	getNotifications: (req, res) => middleware(req, res, getNotifications, ["token"]),
	patchNotification: (req, res) => middleware(req, res, patchNotification, ["token"]),
	sendNotifications,
};
