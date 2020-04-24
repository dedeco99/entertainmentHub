import { api } from "../utils/request";

async function getWeather(lat, lon) {
	const res = await api({
		method: "get",
		url: `/api/weather/${lat}/${lon}`,
	});

	return res;
}

async function getCities(filter) {
	const res = await api({
		method: "get",
		url: `/api/weather/cities?filter=${filter}`,
	});

	return res;
}

export {
	getWeather,
	getCities,
};
