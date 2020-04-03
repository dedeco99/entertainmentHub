/* global sockets */

const { middleware, response } = require("./utils");
const errors = require("./errors");

const Notification = require("./models/notification");

async function getNotifications(event) {
	const { query, user } = event;
	const { history } = query;

	const notifications = await Notification.find(
		{ user: user._id, active: !history },
	).sort({ _created: -1 }).lean();

	return response(200, "Notifications found", notifications);
}

async function patchNotification(event) {
	const { params } = event;
	const { id } = params;

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

async function deleteNotification(event) {
	const { params } = event;
	const { id } = params;

	let notification = null;
	try {
		notification = await Notification.findOneAndDelete({ _id: id });
	} catch (e) {
		throw errors.notFound;
	}

	if (!notification) throw errors.notFound;

	return response(200, "Notification deleted", notification);
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
	deleteNotification: (req, res) => middleware(req, res, deleteNotification, ["token"]),
	sendNotifications,
};
