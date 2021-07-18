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

async function getStocks(stocks) {
	const res = await api({
		method: "get",
		url: `/api/stocks/${stocks}`,
	});

	return res;
}

export { getCoins, getCrypto, getStocks };
