const { middleware, response } = require("./middleware");
const errors = require("./errors");
const { api } = require("./request");

const moment = require("moment");

async function getCoins(event) {
	const { query } = event;
	const { filter } = query;

	let useCache = true;
	let data = global.cache.crypto.coins;

	if (!data.length || moment().diff(moment(global.cache.crypto.lastUpdate), "hours") > 24) {
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
		.filter(coin => (
			coin.name.toLowerCase().includes(filter.toLowerCase()) ||
			coin.symbol.toLowerCase().includes(filter.toLowerCase())
		))
		.slice(0, 50)
		.map(coin => ({
			symbol: coin.symbol,
			name: coin.name,
			created: coin.first_historical_data,
		}))
		.sort((a, b) => a.created <= b.created ? -1 : 1);

	return response(200, "Coins found", coins);
}

async function getPrices(event) {
	const { params } = event;
	const { coins } = params;

	let useCache = true;
	let data = global.cache.crypto.data;

	for (const symbol of coins.split(",")) {
		const coin = data[symbol];

		console.log(coin && moment().diff(moment(coin.lastUpdate), "minutes"));

		if (
			!coin ||
			moment().diff(moment(coin.lastUpdate), "minutes") > 10
		) {
			useCache = false;
		}
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
		});
	}

	coinsInfo.sort((a, b) => a.rank <= b.rank ? -1 : 1);

	return response(200, "Coin found", coinsInfo.length === 1 ? coinsInfo[0] : coinsInfo);
}

module.exports = {
	getCoins: (req, res) => middleware(req, res, getCoins, ["token"]),
	getPrices: (req, res) => middleware(req, res, getPrices, ["token"]),
};
