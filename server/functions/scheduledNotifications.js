const { response } = require("../utils/request");
const errors = require("../utils/errors");

const ScheduledNotification = require("../models/scheduledNotification");

async function getScheduledNotifications(event) {
	const { user } = event;

	const scheduledNotifications = await ScheduledNotification.find({ user: user._id }).lean();

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

	await scheduledNotification.save();

	return response(201, "ADD_SCHEDULED_NOTIFICATION", scheduledNotification);
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

	return response(200, "DELETE_SCHEDULED_NOTIFICATION", scheduledNotification);
}

module.exports = {
	getScheduledNotifications,
	addScheduledNotification,
	deleteScheduledNotification,
};
