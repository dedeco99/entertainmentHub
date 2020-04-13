import { get } from "../utils/request";

async function getWeather(lat, lon) {
	const res = await get(`api/weather/${lat}/${lon}`);

	return res;
}

async function getCities(filter) {
	const res = await get(`api/weather/cities?filter=${filter}`);

	return res;
}

export {
	getWeather,
	getCities,
};
