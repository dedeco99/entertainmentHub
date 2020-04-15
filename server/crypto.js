const { middleware, response } = require("./middleware");
const errors = require("./errors");
const { api } = require("./request");

async function getCoins(event) {
	const { query } = event;
	const { filter } = query;

	const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map";
	const headers = { "X-CMC_PRO_API_KEY": process.env.coinmarketcapKey };

	const res = await api({ method: "get", url, headers });
	const json = res.data;

	const coins = json.data
		.filter(coin => (
			coin.name.toLowerCase().includes(filter.toLowerCase()) ||
			coin.symbol.toLowerCase().includes(filter.toLowerCase())
		))
		.slice(0, 50)
		.map(coin => ({
			symbol: coin.symbol,
			name: coin.name,
		}))
		.sort((a, b) => a.name <= b.name ? -1 : 1);

	return response(200, "Coins found", coins);
}

async function getPrices(event) {
	const { params } = event;
	const { coins } = params;

	const headers = { "X-CMC_PRO_API_KEY": process.env.coinmarketcapKey };

	const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${coins}&&convert=EUR`;

	const res = await api({ method: "get", url, headers });
	const json = res.data;

	if (json.error) return errors.coinmarketcapForbidden;

	const coinsInfo = [];
	for (const symbol in json.data) {
		const coin = json.data[symbol];

		coinsInfo.push({
			id: coin.id,
			name: coin.name,
			symbol: coin.symbol,
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

	return response(200, "Coin found", coinsInfo.length === 1 ? coinsInfo[0] : coinsInfo);
}

module.exports = {
	getCoins: (req, res) => middleware(req, res, getCoins, ["token"]),
	getPrices: (req, res) => middleware(req, res, getPrices, ["token"]),
};
