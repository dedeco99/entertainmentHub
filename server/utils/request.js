const axios = require("axios");

const log = require("./log");

async function api({ method, url, data, headers = {} }) {
	try {
		const res = await axios.request({ method, url, data, headers });

		return {
			status: res.status,
			data: res.data,
		};
	} catch (error) {
		log.error(error.stack);

		return {
			status: error.response.status,
			data: error.response.data,
		};
	}
}

module.exports = {
	api,
};
