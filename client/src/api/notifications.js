import { api } from "../utils/request";

async function getNotifications(page, history, filter) {
	let query = "";
	query += page >= 0 ? `?page=${page}` : "";
	query += history ? `${query ? "&" : "?"}history=true` : "";
	query += filter ? `${query ? "&" : "?"}type=${filter}` : "";

	const res = await api({
		method: "get",
		url: `/api/notifications${query}`,
	});

	return res;
}

async function patchNotifications(id) {
	const res = await api({
		method: "patch",
		url: `/api/notifications/${id}`,
		message: true,
	});

	return res;
}

async function deleteNotifications(id) {
	const res = await api({
		method: "delete",
		url: `/api/notifications/${id}`,
		message: true,
	});

	return res;
}

export {
	getNotifications,
	patchNotifications,
	deleteNotifications,
};
