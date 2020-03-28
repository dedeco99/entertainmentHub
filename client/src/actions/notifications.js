import { get } from "../utils/request";

async function getNotifications() {
	const res = await get("api/notifications");

	return res;
}

export {
	getNotifications,
};
