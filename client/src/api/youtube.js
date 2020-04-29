import { api } from "../utils/request";

async function getSubscriptions(after) {
	const res = await api({
		method: "get",
		url: `api/youtube/subscriptions${after ? `?after=${after}` : ""}`,
	});

	return res;
}

export {
	getSubscriptions,
};
