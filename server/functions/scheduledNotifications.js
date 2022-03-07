const dayjs = require("dayjs");
const cron = require("node-cron");

const { response } = require("../utils/request");
const errors = require("../utils/errors");

const { sendNotification } = require("./notifications");

const ScheduledNotification = require("../models/scheduledNotification");

async function cronjobScheduler(toSchedule) {
	let scheduledNotifications = toSchedule;
	if (!scheduledNotifications) {
		global.cronjobs = [];

		scheduledNotifications = await ScheduledNotification.find({
			sent: false,
			dateToSend: { $lte: dayjs().endOf("year") },
		}).lean();
	}

	const notifications = [];
	for (const scheduledNotification of scheduledNotifications) {
		const { _id, dateToSend, notificationId, user, type, info } = scheduledNotification;

		switch (type) {
			case "tv":
				notifications.push({
					scheduledNotification: _id,
					dateToSend,
					notificationId,
					type,
					info,
				});

				break;
			case "reminder":
				notifications.push({
					scheduledNotification: scheduledNotification._id,
					dateToSend,
					notificationId: scheduledNotification._id,
					user,
					type,
					topPriority: true,
					priority: 3,
					info,
				});

				break;
			default:
				break;
		}
	}

	for (const notification of notifications) {
		const date = dayjs(notification.dateToSend);

		if (date.diff(dayjs(), "minutes") < 0) {
			await sendNotification(notification);
		}

		const cronExpression = `${date.minute()} ${date.hour()} ${date.date()} ${date.month() + 1} *`;

		const task = cron.schedule(cronExpression, async () => {
			await sendNotification(notification);
		});

		global.cronjobs.push({ scheduledNotification: notification.scheduledNotification, task });
	}
}

async function getScheduledNotifications(event) {
	const { user } = event;

	const scheduledNotifications = await ScheduledNotification.find({ user: user._id, sent: false }).lean();

	return response(200, "GET_SCHEDULED_NOTIFICATIONS", scheduledNotifications);
}

async function addScheduledNotification(event) {
	const { body, user } = event;
	const { dateToSend, type, info } = body;

	if (!dateToSend || !type || !info) return errors.requiredFieldsMissing;

	switch (type) {
		case "reminder":
			if (!info.reminder) return errors.requiredFieldsMissing;

			break;
		default:
			break;
	}

	const scheduledNotification = new ScheduledNotification({
		dateToSend,
		user: user._id,
		type,
		info,
	});

	scheduledNotification.notificationId = scheduledNotification._id;

	await scheduledNotification.save();

	cronjobScheduler([scheduledNotification]);

	return response(201, "ADD_SCHEDULED_NOTIFICATION", scheduledNotification);
}

async function addScheduledNotifications(notifications) {
	const scheduledNotifications = [];
	for (const notification of notifications) {
		const { dateToSend, notificationId, type, info } = notification;

		const notificationExists = await ScheduledNotification.findOne({ type, notificationId }).lean();

		if (!notificationExists) {
			const scheduledNotification = new ScheduledNotification({
				dateToSend,
				notificationId,
				type,
				info,
			});

			await scheduledNotification.save();

			scheduledNotifications.push(scheduledNotification);
		}
	}

	cronjobScheduler(scheduledNotifications);
}

async function deleteScheduledNotification(event) {
	const { params } = event;
	const { id } = params;

	let scheduledNotification = null;
	try {
		scheduledNotification = await ScheduledNotification.findOneAndDelete({ _id: id });
	} catch (e) {
		return errors.notFound;
	}

	if (!scheduledNotification) return errors.notFound;

	const index = global.cronjobs.findIndex(c => c.scheduledNotification.toString() === id);

	const cronjobs = global.cronjobs.splice(index, 1);

	if (cronjobs[0]) cronjobs[0].task.stop();

	return response(200, "DELETE_SCHEDULED_NOTIFICATION", scheduledNotification);
}

module.exports = {
	cronjobScheduler,
	getScheduledNotifications,
	addScheduledNotification,
	addScheduledNotifications,
	deleteScheduledNotification,
};
