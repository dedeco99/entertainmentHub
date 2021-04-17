import { api } from "../utils/request";

async function getScheduledNotifications() {
	const res = await api({
		method: "get",
		url: "/api/scheduled-notifications",
	});

	return res;
}

async function addScheduledNotification(scheduledNotification) {
	const res = await api({
		method: "post",
		url: "/api/scheduled-notifications",
		data: scheduledNotification,
		message: true,
	});

	return res;
}

async function editScheduledNotification(scheduledNotification) {
	const res = await api({
		method: "put",
		url: `/api/scheduled-notifications/${scheduledNotification._id}`,
		data: scheduledNotification,
	});

	return res;
}

async function deleteScheduledNotification(id) {
	const res = await api({
		method: "delete",
		url: `/api/scheduled-notifications/${id}`,
	});

	return res;
}

export {
	getScheduledNotifications,
	addScheduledNotification,
	editScheduledNotification,
	deleteScheduledNotification,
};
