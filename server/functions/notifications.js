const { response } = require("../utils/request");
const errors = require("../utils/errors");

const Notification = require("../models/notification");
const ScheduledNotification = require("../models/scheduledNotification");
const Series = require("../models/series");

async function getNotifications(event) {
	const { query, user } = event;
	const { type, history, page } = query;

	const searchQuery = {
		user: user._id,
		active: !history,
	};

	const total = await Notification.countDocuments(searchQuery);

	if (type) searchQuery.type = type;

	const sortQuery = { dateToSend: -1, _id: -1 };

	const notifications = await Notification.aggregate([
		{ $match: searchQuery },
		{ $sort: sortQuery },
		{ $skip: page ? page * 25 : 0 },
		{ $limit: 25 },
	]);

	return response(200, "Notifications found", { notifications, total });
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
		return errors.notFound;
	}

	if (!notification) return errors.notFound;

	return response(200, "Notification updated", notification);
}

async function deleteNotification(event) {
	const { params } = event;
	const { id } = params;

	let notification = null;
	try {
		notification = await Notification.findOneAndDelete({ _id: id });
	} catch (e) {
		return errors.notFound;
	}

	if (!notification) return errors.notFound;

	return response(200, "Notification deleted", notification);
}

async function addNotifications(notifications) {
	for (const notification of notifications) {
		const { dateToSend, notificationId, user, type, info } = notification;

		const notificationExists = await Notification.findOne({ user, type, notificationId }).lean();

		if (!notificationExists) {
			const newNotification = new Notification({
				dateToSend,
				notificationId,
				user,
				type,
				info,
			});

			await newNotification.save();

			if (global.sockets[notification.user]) {
				for (const socket of global.sockets[notification.user]) {
					socket.emit("notification", newNotification);
				}
			}
		}
	}
}

async function scheduleNotifications(notifications) {
	for (const notification of notifications) {
		const { dateToSend, notificationId, type, info } = notification;

		const notificationExists = await ScheduledNotification.findOne({ type, notificationId }).lean();

		if (!notificationExists) {
			const newNotification = new ScheduledNotification({
				dateToSend,
				notificationId,
				type,
				info,
			});

			await newNotification.save();
		}
	}
}

async function cronjob() {
	const scheduledNotifications = await ScheduledNotification.find({
		sent: false,
		dateToSend: { $lte: Date.now() },
	}).lean();

	const notifications = [];
	for (const scheduledNotification of scheduledNotifications) {
		const { dateToSend, notificationId, type, info } = scheduledNotification;

		switch (type) {
			case "tv":
				const userSeries = await Series.find({ seriesId: info.seriesId }).lean();

				for (const series of userSeries) {
					notifications.push(new Notification({
						dateToSend,
						notificationId: `${series.user}${notificationId}`,
						user: series.user,
						type,
						info: { ...info, displayName: series.displayName },
					}));
				}

				break;
			default:
				break;
		}
	}

	await addNotifications(notifications);

	await ScheduledNotification.updateMany(
		{ sent: false, dateToSend: { $lte: Date.now() } },
		{ sent: true },
	).lean();
}

module.exports = {
	getNotifications,
	patchNotification,
	deleteNotification,
	addNotifications,
	scheduleNotifications,
	cronjob,
};
