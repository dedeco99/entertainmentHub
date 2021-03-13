const dayjs = require("dayjs");
const cron = require("node-cron");

const { response } = require("../utils/request");
const { toObjectId } = require("../utils/utils");

const Notification = require("../models/notification");
const ScheduledNotification = require("../models/scheduledNotification");
const Subscription = require("../models/subscription");
const Episode = require("../models/episode");

async function getNotifications(event) {
	const { query, user } = event;
	const { type, history, after } = query;

	const searchQuery = {
		user: user._id,
		active: !history,
	};

	const total = await Notification.countDocuments(searchQuery);

	if (after) searchQuery._id = { $lt: toObjectId(after) };
	if (type) searchQuery.type = type;

	const sortQuery = { dateToSend: -1, _id: -1 };

	const notifications = await Notification.aggregate([
		{ $match: searchQuery },
		{ $sort: sortQuery },
		{ $limit: 25 },
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
		console.log("notification", notification);
		const { active, dateToSend, notificationId, user, type, info } = notification;

		const notificationExists = await Notification.findOne({ user, type, notificationId }).lean();

		if (!notificationExists) {
			const newNotification = new Notification({
				active,
				dateToSend,
				notificationId,
				user,
				type,
				info,
			});

			await newNotification.save();

			if (active) {
				if (global.sockets[user]) {
					for (const socket of global.sockets[user]) {
						socket.emit("notification", newNotification);
					}
				}
			}

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
		dateToSend: { $lte: dayjs().endOf("year") },
	}).lean();

	const notifications = [];
	for (const scheduledNotification of scheduledNotifications) {
		const { dateToSend, notificationId, user, type, info } = scheduledNotification;

		switch (type) {
			case "tv":
				const userSeries = await Subscription.find({
					platform: "tv",
					externalId: info.seriesId,
					"notifications.active": true,
				}).lean();
				const episode = await Episode.findOne({
					seriesId: info.seriesId,
					season: info.season,
					number: info.number,
				}).lean();

				for (const series of userSeries) {
					notifications.push({
						scheduledNotification: scheduledNotification._id,
						dateToSend,
						notificationId: `${series.user}${notificationId}`,
						user: series.user,
						type,
						info: {
							...info,
							displayName: series.displayName,
							thumbnail: episode.image,
							episodeTitle: episode.title,
						},
					});
				}

				break;
			case "reminder":
				notifications.push({
					scheduledNotification: scheduledNotification._id,
					dateToSend,
					notificationId,
					user,
					type,
					info,
				});

				break;
			default:
				break;
		}
	}

	for (const notification of notifications) {
		const date = dayjs(notification.dateToSend);

		console.log(notification.dateToSend);

		// TODO: if date is lower than current date send notification

		const cronExpression = `${date.minute()} ${date.hour()} ${date.date()} ${date.month() + 1} *`;
		console.log("expression", cronExpression);

		cron.schedule(cronExpression, async () => {
			console.log("sent");
			await addNotifications([notification]);
			await ScheduledNotification.updateOne({ _id: notification.scheduledNotification }, { sent: true }).lean();
		});
	}
}

module.exports = {
	getNotifications,
	patchNotifications,
	deleteNotifications,
	addNotifications,
	scheduleNotifications,
	cronjob,
};
