import { api } from "../utils/request";

async function getNotifications(after, history, filter) {
	let query = "";
	query += after ? `?after=${after}` : "";
	query += history ? `${query ? "&" : "?"}history=true` : "";
	query += filter ? `${query ? "&" : "?"}type=${filter}` : "";

	const res = await api({
		method: "get",
		url: `/api/notifications${query}`,
	});

	return res;
}

async function patchNotifications(id, active) {
	const res = await api({
		method: "patch",
		url: `/api/notifications/${id}`,
		data: { active },
	});

	return res;
}

async function deleteNotifications(id) {
	const res = await api({
		method: "delete",
		url: `/api/notifications/${id}`,
	});

	return res;
}

export { getNotifications, patchNotifications, deleteNotifications };
