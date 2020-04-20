import { api } from "../utils/request";

async function getSubscriptions() {
	const res = await api({
		method: "get",
		url: "api/youtube/subscriptions",
	});

	return res;
}

export {
	getSubscriptions,
};
