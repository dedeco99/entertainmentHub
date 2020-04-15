import { api } from "../utils/request";

async function getCrypto(coin) {
	const res = await api({
		method: "get",
		url: `api/crypto/${coin}`,
	});

	return res;
}

export {
	getCrypto,
};
