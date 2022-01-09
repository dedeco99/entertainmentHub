import { api } from "../utils/request";

async function getSubscriptions(platform) {
	const res = await api({
		method: "get",
		url: `/api/subscriptions/${platform}`,
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

export { getSubscriptions, addSubscriptions, editSubscription, patchSubscription, deleteSubscription };
