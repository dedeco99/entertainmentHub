import { api } from "../utils/request";

async function getScheduledNotifications() {
	const res = await api({
		method: "get",
		url: "/api/scheduled-notifications",
	});

	return res;
}

async function deleteScheduledNotification(notificationId) {
	const res = await api({
		method: "delete",
		url: `/api/scheduled-notifications/${notificationId}`,
	});

	return res;
}

export { getScheduledNotifications, deleteScheduledNotification };
