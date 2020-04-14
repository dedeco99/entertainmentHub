import { api } from "../utils/request";

async function getNotifications(history, filter) {
	let query = "";
	if (history) {
		query = filter ? `?history=true&type=${filter}` : "?history=true";
	} else if (filter) {
		query = `?type=${filter}`;
	}
	const res = await api({
		method: "get",
		url: `api/notifications${query}`,
	});

	return res;
}

async function patchNotifications(id) {
	const res = await api({
		method: "patch",
		url: `api/notifications/${id}`,
		message: true,
	});

	return res;
}

async function deleteNotifications(id) {
	const res = await api({
		method: "delete",
		url: `api/notifications/${id}`,
		message: true,
	});

	return res;
}

export {
	getNotifications,
	patchNotifications,
	deleteNotifications,
};
