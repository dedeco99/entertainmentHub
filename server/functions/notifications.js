const dayjs = require("dayjs");

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

	if (after) {
		const lastNotification = await Notification.findOne({ _id: after }).lean();

		searchQuery._id = { $ne: toObjectId(lastNotification._id) };
		searchQuery.dateToSend = { $lte: dayjs(lastNotification.dateToSend).toDate() };
	}
	if (type) searchQuery.type = type;

	const sortQuery = history ? { dateToSend: -1 } : { topPriority: -1, dateToSend: -1 };

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

// eslint-disable-next-line complexity
async function addNotifications(notifications) {
	for (const notification of notifications) {
		const { dateToSend, notificationId, subscription, user, type, info } = notification;

		const notificationExists = await Notification.findOne({ user, type, notificationId }).lean();

		if (!notificationExists) {
			const notificationBody = {
				active: subscription.notifications.active,
				dateToSend,
				notificationId,
				subscription,
				user,
				type,
				priority: subscription.notifications.priority,
				topPriority: subscription.notifications.priority === 3,
				info,
			};

			for (const rule of subscription.notifications.rules) {
				if (
					(rule.if.hasTheseWords &&
						rule.if.hasTheseWords.length &&
						rule.if.doesntHaveTheseWords &&
						rule.if.doesntHaveTheseWords.length &&
						rule.if.hasTheseWords.some(v => info.videoTitle.includes(v)) &&
						!rule.if.doesntHaveTheseWords.some(v => info.videoTitle.includes(v))) ||
					(rule.if.hasTheseWords &&
						rule.if.hasTheseWords.length &&
						rule.if.hasTheseWords.some(v => info.videoTitle.includes(v))) ||
					(rule.if.doesntHaveTheseWords &&
						rule.if.doesntHaveTheseWords.length &&
						!rule.if.doesntHaveTheseWords.some(v => info.videoTitle.includes(v)))
				) {
					if ("active" in rule.then) {
						notificationBody.active = rule.then.active;
					}

					if ("priority" in rule.then) {
						notificationBody.priority = rule.then.priority;
						notificationBody.topPriority = rule.then.priority === 3;
					}

					if ("autoAddToWatchLater" in rule.then) {
						notificationBody.subscription.notifications.autoAddToWatchLater = rule.then.autoAddToWatchLater;
					}

					if ("watchLaterPlaylist" in rule.then) {
						notificationBody.subscription.notifications.watchLaterPlaylist = rule.then.watchLaterPlaylist;
					}
				}
			}

			const newNotification = new Notification(notificationBody);

			await newNotification.save();

			if (notificationBody.active) {
				if (global.sockets[user]) {
					for (const socket of global.sockets[user]) {
						socket.emit("notification", notificationBody);
					}
				}
			}

			if (notificationBody.subscription.notifications.autoAddToWatchLater) {
				const { addToWatchLater } = require("./youtube"); //eslint-disable-line

				addToWatchLater({
					user: {
						_id: user,
						settings: {
							youtube: {
								watchLaterPlaylist: notificationBody.subscription.notifications.defaultWatchLaterPlaylist,
							},
						},
					},
					body: {
						videos: [{ videoId: notificationBody.info.videoId, channelId: notificationBody.info.channelId }],
						playlist: notificationBody.subscription.notifications.watchLaterPlaylist,
					},
				});
			}
		}
	}
}

async function sendNotification(notification) {
	const { scheduledNotification, dateToSend, notificationId, type, info } = notification;

	const notifications = [];
	if (type === "tv") {
		const episode = await Episode.findOne({
			seriesId: info.seriesId,
			season: info.season,
			number: info.number,
		}).lean();
		const userSeries = await Subscription.find({
			active: true,
			platform: "tv",
			externalId: info.seriesId,
			"notifications.active": true,
		}).lean();

		if (episode) {
			for (const series of userSeries) {
				notifications.push({
					dateToSend,
					notificationId: `${series.user}${notificationId}`,
					subscription: series,
					user: series.user,
					type,
					info: {
						displayName: series.displayName,
						thumbnail: episode.image,

						season: episode.season,
						number: episode.number,
						episodeTitle: episode.title,
					},
				});
			}
		} else {
			await ScheduledNotification.deleteOne({ _id: scheduledNotification });

			return;
		}
	} else {
		notifications.push(notification);
	}

	await addNotifications(notifications);

	await ScheduledNotification.updateOne({ _id: scheduledNotification }, { sent: true }).lean();
}

module.exports = {
	getNotifications,
	patchNotifications,
	deleteNotifications,
	addNotifications,
	sendNotification,
};
