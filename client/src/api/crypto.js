import { api } from "../utils/request";

async function getCoins(filter) {
	const res = await api({
		method: "get",
		url: `/api/crypto?filter=${filter}`,
	});

	return res;
}

async function getCrypto(coin) {
	const res = await api({
		method: "get",
		url: `/api/crypto/${coin}`,
	});

	return res;
}

export {
	getCoins,
	getCrypto,
};
