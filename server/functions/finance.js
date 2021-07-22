const yahooFinance = require("yahoo-finance2").default;
const dayjs = require("dayjs");

const { response, api } = require("../utils/request");
const errors = require("../utils/errors");
const { diff } = require("../utils/utils");

async function getCoins(event) {
	const { query } = event;
	const { filter } = query;

	let useCache = true;
	let data = global.cache.crypto.coins;

	if (!data.length || diff(global.cache.crypto.lastUpdate, "hours") > 24) {
		useCache = false;
	}

	if (!useCache) {
		const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map";
		const headers = { "X-CMC_PRO_API_KEY": process.env.coinmarketcapKey };

		const res = await api({ method: "get", url, headers });
		const json = res.data;

		data = json.data;
		global.cache.crypto.coins = json.data;
	}

	const coins = data
		.filter(
			coin =>
				coin.name.toLowerCase().includes(filter.toLowerCase()) ||
				coin.symbol.toLowerCase().includes(filter.toLowerCase()),
		)
		.slice(0, 50)
		.map(coin => ({
			symbol: coin.symbol,
			name: coin.name,
			created: coin.first_historical_data,
		}))
		.sort((a, b) => (a.created <= b.created ? -1 : 1));

	return response(200, "GET_COINS", coins);
}

async function getCryptoPrices(event) {
	const { params, user } = event;
	const { coins } = params;

	let useCache = true;
	let data = global.cache.crypto.data;

	for (const symbol of coins.split(",")) {
		const coin = data[user.settings.currency] ? data[user.settings.currency][symbol] : null;

		if (!coin || diff(coin.lastUpdate, "minutes") > 10) useCache = false;
	}

	if (!useCache) {
		const headers = { "X-CMC_PRO_API_KEY": process.env.coinmarketcapKey };

		const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${coins}&convert=${user.settings.currency}`;

		const res = await api({ method: "get", url, headers });
		const json = res.data;

		if (json.error) return errors.coinmarketcapForbidden;

		data = json.data;
	}

	const coinsInfo = [];
	for (const symbol of coins.split(",")) {
		const coin = data[symbol];

		coin.lastUpdate = Date.now();
		global.cache.crypto.data[user.settings.currency] = {};
		global.cache.crypto.data[user.settings.currency][symbol] = coin;

		coinsInfo.push({
			id: coin.id,
			name: coin.name,
			symbol: coin.symbol,
			image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
			rank: coin.cmc_rank,
			dateAdded: coin.date_added,
			circulatingSupply: coin.circulating_supply,
			totalSupply: coin.total_supply,
			maxSupply: coin.max_supply,
			price: coin.quote[user.settings.currency].price,
			marketCap: coin.quote[user.settings.currency].market_cap,
			volume: coin.quote[user.settings.currency].volume_24h,
			change1h: coin.quote[user.settings.currency].percent_change_1h,
			change24h: coin.quote[user.settings.currency].percent_change_24h,
			change7d: coin.quote[user.settings.currency].percent_change_7d,
			change30d: coin.quote[user.settings.currency].percent_change_30d,
		});
	}

	coinsInfo.sort((a, b) => (a.rank <= b.rank ? -1 : 1));

	return response(200, "GET_COIN", coinsInfo);
}

async function getStocks(event) {
	const { query } = event;
	const { filter } = query;

	const res = await yahooFinance.autoc(filter);

	const stocks = res.Result.slice(0, 50).map(stock => ({ symbol: stock.symbol, name: stock.name }));

	return response(200, "GET_STOCKS", stocks);
}

async function getStockPrices(event) {
	const { params, user } = event;
	const { stocks } = params;

	const quoteRes = await yahooFinance.quote(stocks.split(","));

	let useCache = true;
	let data = global.cache.exchangeRates.data;

	if (!Object.keys(data).length || diff(global.cache.exchangeRates.lastUpdate, "minutes") > 1) {
		useCache = false;
	}

	if (!useCache) {
		const url = `https://api.exchangerate.host/latest?base=${user.settings.currency}`;

		const res = await api({ method: "GET", url });

		data = res.data;
		global.cache.exchangeRates.data = res.data;
	}

	const stocksInfo = [];
	for (const stock of quoteRes) {
		const historicalRes = await yahooFinance.historical(stock.symbol, {
			period1: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
		});

		const price =
			stock.currency === user.settings.currency
				? stock.regularMarketPrice
				: stock.regularMarketPrice / data.rates[stock.currency];

		const openPrice =
			stock.currency === user.settings.currency
				? stock.regularMarketOpen
				: stock.regularMarketOpen / data.rates[stock.currency];

		const weekPrice =
			stock.currency === user.settings.currency
				? historicalRes[historicalRes.length - 7].close
				: historicalRes[historicalRes.length - 7].close / data.rates[stock.currency];

		const monthPrice =
			stock.currency === user.settings.currency
				? historicalRes[0].close
				: historicalRes[0].close / data.rates[stock.currency];

		stocksInfo.push({
			id: stock.symbol,
			name: stock.shortName,
			symbol: stock.symbol,
			image: `https://companiesmarketcap.com/img/company-logos/80/${stock.symbol}.png`,
			price,
			marketCap: stock.marketCap,
			volume: stock.regularMarketVolume,
			change1h: ((price - openPrice) / openPrice) * 100,
			change24h: stock.regularMarketChangePercent,
			change7d: ((price - weekPrice) / weekPrice) * 100,
			change30d: ((price - monthPrice) / monthPrice) * 100,
		});
	}

	return response(200, "GET_STOCK_PRICES", stocksInfo);
}

module.exports = {
	getCoins,
	getCryptoPrices,
	getStocks,
	getStockPrices,
};
