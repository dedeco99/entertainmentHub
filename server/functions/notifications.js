const dayjs = require("dayjs");

const { response } = require("../utils/request");
const { toObjectId } = require("../utils/utils");

const Notification = require("../models/notification");
const ScheduledNotification = require("../models/scheduledNotification");

async function getNotifications(event) {
	const { query, user } = event;
	const { type, history, after } = query;

	const searchQuery = {
		user: user._id,
		active: !history,
	};

	const total = await Notification.countDocuments(searchQuery);

	if (after) {
		const lastNotification = await Notification.findOne({ _id: after }).lean();

		searchQuery._id = { $ne: toObjectId(lastNotification._id) };
		searchQuery.dateToSend = { $lte: dayjs(lastNotification.dateToSend).toDate() };
	}
	if (type) searchQuery.type = type;

	const sortQuery = { topPriority: -1, dateToSend: -1 };

	const notifications = await Notification.aggregate([
		{ $match: searchQuery },
		{ $sort: sortQuery },
		{ $limit: 25 },
		{
			$lookup: {
				from: "subscriptions",
				localField: "subscription",
				foreignField: "_id",
				as: "subscription",
			},
		},
		{ $unwind: { path: "$subscription", preserveNullAndEmptyArrays: true } },
	]);

	return response(200, "GET_NOTIFICATIONS", { notifications, total });
}

async function patchNotifications(event) {
	const { body } = event;
	const { notifications, active } = body;

	await Notification.updateMany({ _id: { $in: notifications } }, { active });

	const updatedNotifications = await Notification.find({ _id: { $in: notifications } }).lean();

	return response(200, "EDIT_NOTIFICATIONS", updatedNotifications);
}

async function deleteNotifications(event) {
	const { body } = event;
	const { notifications } = body;

	await Notification.deleteMany({ _id: { $in: notifications } });

	const updatedNotifications = notifications.map(_id => ({ _id }));

	return response(200, "DELETE_NOTIFICATION", updatedNotifications);
}

async function addNotifications(notifications) {
	for (const notification of notifications) {
		const { active, dateToSend, notificationId, subscription, user, type, topPriority, priority, info } =
			notification;

		const notificationExists = await Notification.findOne({ user, type, notificationId }).lean();

		if (!notificationExists) {
			const newNotification = new Notification({
				active,
				dateToSend,
				notificationId,
				subscription,
				user,
				type,
				topPriority,
				priority,
				info,
			});

			if (active) {
				const doesNotHaveWords =
					info.dontShowWithTheseWords && info.dontShowWithTheseWords.length
						? !info.dontShowWithTheseWords.some(v => info.videoTitle.includes(v))
						: true;
				const hasWords =
					info.onlyShowWithTheseWords && info.onlyShowWithTheseWords.length
						? info.onlyShowWithTheseWords.some(v => info.videoTitle.includes(v))
						: true;

				if (doesNotHaveWords && hasWords) {
					if (global.sockets[user]) {
						for (const socket of global.sockets[user]) {
							socket.emit("notification", newNotification);
						}
					}
				} else {
					newNotification.active = false;
				}
			}

			await newNotification.save();

			if (info.autoAddToWatchLater) {
				const { addToWatchLater } = require("./youtube"); //eslint-disable-line

				addToWatchLater({
					user: { _id: user, settings: { youtube: { watchLaterPlaylist: info.watchLaterPlaylist } } },
					body: { videos: [{ videoId: info.videoId, channelId: info.channelId }] },
				});
			}
		}
	}
}

async function sendNotification(notification) {
	await addNotifications([notification]);
	await ScheduledNotification.updateOne({ _id: notification.scheduledNotification }, { sent: true }).lean();
}

module.exports = {
	getNotifications,
	patchNotifications,
	deleteNotifications,
	addNotifications,
	sendNotification,
};
