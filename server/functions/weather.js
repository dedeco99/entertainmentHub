const { response, api } = require("../utils/request");
const { formatDate } = require("../utils/utils");

const allTheCities = require("all-the-cities");

async function getWeather(event) {
	const { params } = event;
	const { lat, lon } = params;

	const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.openWeatherMapKey}`;

	const res = await api({ method: "get", url });
	const json = res.data;

	const minTemp = json.daily[0].temp.min;
	const maxTemp = json.daily[0].temp.max;

	json.hourly.shift();
	json.daily.shift();

	const weather = {
		current: {
			sunrise: formatDate(json.current.sunrise * 1000, "HH:mm"),
			sunset: formatDate(json.current.sunset * 1000, "HH:mm"),
			temp: json.current.temp,
			feelsLike: json.current.feels_like,
			minTemp,
			maxTemp,
			pressure: json.current.pressure,
			humidity: json.current.humidity,
			clouds: json.current.clouds,
			uv: json.current.uvi,
			visibility: json.current.visibility,
			windSpeed: json.current.wind_speed,
			windDirection: json.current.wind_deg,
			rain: json.current.rain,
			snow: json.current.snow,
			forecast: {
				description: json.current.weather[0].description,
				image: `http://openweathermap.org/img/wn/${json.current.weather[0].icon}@2x.png`,
			},
		},
		hourly: json.hourly.map(hourly => ({
			hour: formatDate(hourly.dt * 1000, "HH:mm"),
			temp: hourly.temp,
			feelsLike: hourly.feels_like,
			pressure: hourly.pressure,
			humidity: hourly.humidity,
			clouds: hourly.clouds,
			uv: hourly.uvi,
			visibility: hourly.visibility,
			windSpeed: hourly.wind_speed,
			windDirection: hourly.wind_deg,
			rain: hourly.rain,
			snow: hourly.snow,
			forecast: {
				description: hourly.weather[0].description,
				image: `http://openweathermap.org/img/wn/${hourly.weather[0].icon}@2x.png`,
			},
		})),
		daily: json.daily.map(daily => ({
			date: formatDate(daily.dt * 1000, "DD-MM-YYYY"),
			sunrise: formatDate(daily.sunrise * 1000, "HH:mm"),
			sunset: formatDate(daily.sunset * 1000, "HH:mm"),
			temp: daily.temp.day,
			feelsLike: daily.feels_like.day,
			minTemp: daily.temp.min,
			maxTemp: daily.temp.max,
			pressure: daily.pressure,
			humidity: daily.humidity,
			clouds: daily.clouds,
			uv: daily.uvi,
			visibility: daily.visibility,
			windSpeed: daily.wind_speed,
			windDirection: daily.wind_deg,
			rain: daily.rain,
			snow: daily.snow,
			forecast: {
				description: daily.weather[0].description,
				image: `http://openweathermap.org/img/wn/${daily.weather[0].icon}@2x.png`,
			},
		})),
	};

	return response(200, "GET_WEATHER", weather);
}

function getCities(event) {
	const { query } = event;
	const { filter } = query;

	const cities = allTheCities
		.filter(city => city.name.toLowerCase().includes(filter.toLowerCase()))
		.slice(0, 50)
		.map(city => ({
			name: city.name,
			country: city.country,
			population: city.population,
			lat: city.loc.coordinates[1],
			lon: city.loc.coordinates[0],
		}))
		.sort((a, b) => a.name <= b.name ? -1 : 1);

	return response(200, "GET_CITIES", cities);
}

module.exports = {
	getWeather,
	getCities,
};
