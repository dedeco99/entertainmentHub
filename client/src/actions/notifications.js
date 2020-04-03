import { get, patch } from "../utils/request";

async function getNotifications() {
	const res = await get("api/notifications");

	return res;
}

async function patchNotification(id) {
	const res = await patch(`api/notifications/${id}`);

	return res;
}

export {
	getNotifications,
	patchNotification,
};
