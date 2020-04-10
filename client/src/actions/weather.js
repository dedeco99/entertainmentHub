import { get } from "../utils/request";

async function getWeather(lat, lon) {
	const res = await get(`api/weather/${lat}/${lon}`);

	return res;
}

export {
	getWeather,
};
