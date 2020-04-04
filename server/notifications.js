/* global sockets */

const moment = require("moment");

const { middleware, response } = require("./utils");
const errors = require("./errors");

const Notification = require("./models/notification");

async function getNotifications(event) {
	const { query, user } = event;
	const { history } = query;

	const notifications = await Notification.find({
		user: user._id,
		active: !history,
		sent: true,
	}).sort({ dateToSend: -1, _id: -1 }).lean();

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

async function addNotifications(notifications) {
	for (const notification of notifications) {
		const { dateToSend, notificationId, user, type, info } = notification;
		if (moment(dateToSend).diff(moment(), "days") >= -5) {
			const notificationExists = await Notification.findOne({ user, type, notificationId }).lean();

			if (!notificationExists) {
				const newNotification = new Notification({ dateToSend, notificationId, user, type, info });
				newNotification.save();
			}
		}
	}
}

async function cronjob() {
	const notifications = await Notification.find({
		sent: false,
		dateToSend: { $lte: Date.now() },
	}).lean();

	for (const notification of notifications) {
		for (const socket of sockets[notification.user]) {
			socket.emit("notification", notification);
		}
	}

	await Notification.updateMany(
		{ sent: false, dateToSend: { $lte: Date.now() } },
		{ sent: true },
	).lean();
}

module.exports = {
	getNotifications: (req, res) => middleware(req, res, getNotifications, ["token"]),
	patchNotification: (req, res) => middleware(req, res, patchNotification, ["token"]),
	deleteNotification: (req, res) => middleware(req, res, deleteNotification, ["token"]),
	addNotifications,
	cronjob,
};
