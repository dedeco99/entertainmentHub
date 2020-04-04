import { get, patch, remove } from "../utils/request";

async function getNotifications(history) {
	const query = history ? "?history=true" : "";
	const res = await get(`api/notifications${query}`);

	return res;
}

async function patchNotifications(id) {
	const res = await patch(`api/notifications/${id}`);

	return res;
}

async function deleteNotifications(id) {
	const res = await remove(`api/notifications/${id}`);

	return res;
}

export {
	getNotifications,
	patchNotifications,
	deleteNotifications,
};
