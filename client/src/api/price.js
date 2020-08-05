import { api } from "../utils/request";

async function getProduct(id) {
	const res = await api({
		method: "get",
		url: `/api/price/${id}`,
	});

	return res;
}

export { getProduct };
