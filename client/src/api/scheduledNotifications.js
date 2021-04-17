import { api } from "../utils/request";

async function getScheduledNotifications() {
	const res = await api({
		method: "get",
		url: "/api/scheduled-notifications",
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

export { getScheduledNotifications, deleteScheduledNotification };
