import { api } from "../utils/request";

async function getSubscriptions(platform, page, perPage, sortBy, sortDesc, group) {
	let query = "";
	query += page >= 0 ? `?page=${page}` : "";
	query += perPage ? `${query ? "&" : "?"}perPage=${perPage}` : "";
	query += sortBy ? `${query ? "&" : "?"}sortBy=${sortBy}` : "";
	query += sortDesc ? `${query ? "&" : "?"}sortDesc=${sortDesc}` : "";
	query += group ? `${query ? "&" : "?"}group=${group}` : "";

	const res = await api({
		method: "get",
		url: `/api/subscriptions/${platform}${query}`,
	});

	return res;
}

async function getSubscriptionGroups(platform) {
	const res = await api({
		method: "get",
		url: `/api/subscriptions/${platform}/groups`,
	});

	return res;
}

async function orderSubscriptionGroups(platform, data) {
	const res = await api({
		method: "patch",
		url: `/api/subscriptions/${platform}/order`,
		data,
	});

	return res;
}

async function addSubscriptions(platform, subscriptions) {
	const res = await api({
		method: "post",
		url: `/api/subscriptions/${platform}`,
		data: { subscriptions },
		message: true,
	});

	return res;
}

async function editSubscription(id, subscription) {
	const res = await api({
		method: "put",
		url: `/api/subscriptions/${id}`,
		data: subscription,
		message: true,
	});

	return res;
}

async function patchSubscription(id, data) {
	const res = await api({
		method: "patch",
		url: `/api/subscriptions/${id}`,
		data,
	});

	return res;
}

async function deleteSubscription(id, archive) {
	const res = await api({
		method: "delete",
		url: `/api/subscriptions/${id}?archive=${archive}`,
		message: true,
	});

	return res;
}

export {
	getSubscriptions,
	getSubscriptionGroups,
	orderSubscriptionGroups,
	addSubscriptions,
	editSubscription,
	patchSubscription,
	deleteSubscription,
};
