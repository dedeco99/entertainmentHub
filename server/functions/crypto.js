const yahooFinance = require("yahoo-finance");
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

async function getPrices(event) {
	const { params } = event;
	const { coins } = params;

	let useCache = true;
	let data = global.cache.crypto.data;

	for (const symbol of coins.split(",")) {
		const coin = data[symbol];

		if (!coin || diff(coin.lastUpdate, "minutes") > 10) useCache = false;
	}

	if (!useCache) {
		const headers = { "X-CMC_PRO_API_KEY": process.env.coinmarketcapKey };

		const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${coins}&convert=EUR`;

		const res = await api({ method: "get", url, headers });
		const json = res.data;

		if (json.error) return errors.coinmarketcapForbidden;

		data = json.data;
	}

	const coinsInfo = [];
	for (const symbol of coins.split(",")) {
		const coin = data[symbol];

		coin.lastUpdate = Date.now();
		global.cache.crypto.data[symbol] = coin;

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
			price: coin.quote.EUR.price,
			marketCap: coin.quote.EUR.market_cap,
			volume: coin.quote.EUR.volume_24h,
			change1h: coin.quote.EUR.percent_change_1h,
			change24h: coin.quote.EUR.percent_change_24h,
			change7d: coin.quote.EUR.percent_change_7d,
			change30d: coin.quote.EUR.percent_change_30d,
		});
	}

	coinsInfo.sort((a, b) => (a.rank <= b.rank ? -1 : 1));

	return response(200, "GET_COIN", coinsInfo);
}

async function getStockPrices(event) {
	const { params } = event;
	const { stocks } = params;

	const historicalRes = await yahooFinance.historical({
		symbols: stocks.split(","),
		from: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
		to: dayjs().format("YYYY-MM-DD"),
	});

	const quoteRes = await yahooFinance.quote({
		symbols: stocks.split(","),
		modules: ["price"],
	});

	const stocksInfo = [];
	for (const stock in quoteRes) {
		const price = quoteRes[stock].price.regularMarketPrice;
		stocksInfo.push({
			id: stock,
			name: quoteRes[stock].price.shortName,
			symbol: stock,
			image: `https://companiesmarketcap.com/img/company-logos/80/${stock}.png`,
			price,
			marketCap: quoteRes[stock].price.marketCap,
			volume: quoteRes[stock].price.regularMarketVolume,
			change1h:
				((price - quoteRes[stock].price.regularMarketOpen) / quoteRes[stock].price.regularMarketOpen) * 100,
			change24h: quoteRes[stock].price.regularMarketChangePercent * 100,
			change7d: ((price - historicalRes[stock][6].close) / historicalRes[stock][6].close) * 100,
			change30d:
				((price - historicalRes[stock][historicalRes[stock].length - 1].close) /
					historicalRes[stock][historicalRes[stock].length - 1].close) *
				100,
		});
	}

	return response(200, "GET_STOCK_PRICES", stocksInfo);
}

module.exports = {
	getCoins,
	getPrices,
	getStockPrices,
};
