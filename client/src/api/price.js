import { api } from "../utils/request";

async function getProduct(country, id) {
	const res = await api({
		method: "get",
		url: `/api/price/${country}/${id}`,
	});

	return res;
}

export { getProduct };
