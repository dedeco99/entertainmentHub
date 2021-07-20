import { api } from "../utils/request";

async function getCoins(filter) {
	const res = await api({
		method: "get",
		url: `/api/crypto?filter=${filter}`,
	});

	return res;
}

async function getCryptoPrices(coin) {
	const res = await api({
		method: "get",
		url: `/api/crypto/${coin}`,
	});

	return res;
}

async function getStocks(filter) {
	const res = await api({
		method: "get",
		url: `/api/stocks?filter=${filter}`,
	});

	return res;
}

async function getStockPrices(stocks) {
	const res = await api({
		method: "get",
		url: `/api/stocks/${stocks}`,
	});

	return res;
}

export { getCoins, getCryptoPrices, getStocks, getStockPrices };
