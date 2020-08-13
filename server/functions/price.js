const cheerio = require("cheerio");
const errors = require("../utils/errors");

const { response, api } = require("../utils/request");
const { diff } = require("../utils/utils");

async function getProduct(event) {
	const { params } = event;
	const { country, product } = params;

	let useCache = true;
	const data = global.cache.price.data;

	if (!data[product] || diff(data[product].lastUpdate, "hours") > 24) useCache = false;

	let productInfo = null;
	if (!useCache) {
		const countryUrl = country === "us" ? "" : `${country}.`;
		const url = `https://${countryUrl}camelcamelcamel.com/product/${product}`;

		const res = await api({ method: "get", url });
		const $ = cheerio.load(res.data);

		const name = $(".show-for-medium").find("a").text();

		if (!name) return errors.productNotFound;

		const image = $(".small-12.medium-2").find("img").attr("src");
		const price = $(".stat").find("span").text();
		const priceTable = $(".product_pane")
			.first()
			.find("tbody")
			.find("tr")
			.toArray()
			.map(elem => $(elem).children().eq(1).text());

		const [current, highest, lowest, average] = priceTable;

		productInfo = {
			image,
			name,
			price,
			history: { current, highest, lowest, average },
			chart: `https://charts.camelcamelcamel.com/es/${product}/amazon.png?force=1&zero=0&w=855&h=513&desired=false&legend=1&ilt=1&tp=all&fo=0&lang=en`,
		};

		productInfo.lastUpdate = Date.now();
		global.cache.price.data[product] = productInfo;
	}

	productInfo = global.cache.price.data[product];

	return response(200, "GET_PRODUCT", productInfo);
}

module.exports = {
	getProduct,
};
