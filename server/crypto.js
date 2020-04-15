const { middleware, response } = require("./middleware");
const errors = require("./errors");
const { api } = require("./request");

async function getCoin(event) {
	const { params } = event;
	const { coin } = params;

	let url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map";
	const headers = { "X-CMC_PRO_API_KEY": process.env.coinmarketcapKey };

	let res = await api({ method: "get", url, headers });
	let json = res.data;

	let coinId = null;
	for (const coinInfo of json.data) {
		if (
			coin.charAt(0).toUpperCase() + coin.slice(1) === coinInfo.name ||
			coin.toUpperCase() === coinInfo.symbol
		) {
			coinId = coinInfo.id;
			break;
		}
	}

	if (!coinId) return errors.notFound;

	url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${coinId}&&convert=EUR`;

	res = await api({ method: "get", url, headers });
	json = res.data;

	if (json.error) return errors.coinmarketcapForbidden;

	const coinInfo = {
		availableSupply: json.data[coinId].total_supply,
		change1h: json.data[coinId].quote.EUR.percent_change_1h,
		change24h: json.data[coinId].quote.EUR.percent_change_24h,
		change7d: json.data[coinId].quote.EUR.percent_change_7d,
		marketcapEur: json.data[coinId].quote.EUR.market_cap,
		name: json.data[coinId].name,
		priceEur: json.data[coinId].quote.EUR.price,
		rank: json.data[coinId].cmc_rank,
		symbol: json.data[coinId].symbol,
		totalSupply: json.data[coinId].max_supply,
		volumeEur: json.data[coinId].quote.EUR.volume_24h,
	};

	return response(200, "Coin found", coinInfo);
}

module.exports = {
	getCoin: (req, res) => middleware(req, res, getCoin, ["token"]),
};
