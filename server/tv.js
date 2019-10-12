const { get } = require("./request");

const { getSeries, createSeries } = require("./database");
const { middleware, response } = require("./utils");

const getSearch = async (event) => {
	const { params } = event;
	const { search } = params;

	const url = `https://api.themoviedb.org/3/search/tv?query=${search}&api_key=${process.env.tmdbKey}`;

	const res = await get(url);
	const json = JSON.parse(res);

	const series = json.results.map(series => {
		return {
			id: series.id,
			displayName: series.name,
			image: `https://image.tmdb.org/t/p/w300_and_h450_bestv2${series.poster_path}`
		};
	});

	return response(200, "Series found", series);
};

const addSeries = async (event) => {
	const { body } = event;
	const { id, displayName, image } = body;

	const userExists = await getSeries({ seriesId: id });

	if (userExists) {
		return response(409, "Series already exists");
	} else {
		await createSeries({ seriesId: id, displayName, image });

		return response(201, "Series has been added");
	}
};

const getSeasons = async (event) => {
	const { params } = event;
	const { series } = params;

	const url = `https://api.themoviedb.org/3/tv/${series}?api_key=${process.env.tmdbKey}`;

	const res = await get(url);
	const json = JSON.parse(res);

	const seasons = json.seasons.map(season => {
		return {
			id: season.id,
			season: season.season_number,
		};
	});

	return response(200, 'Seasons found', seasons);
};


const getAllSeries = (data, callback) => {
	database.firestore.collection("tvSeries")
		.get().then((snapshot) => {
			if (snapshot.size > 0) {
				let itemsProcessed = 0;
				let episodes = [];

				snapshot.docs.forEach((item, index) => {
					item = item.data();
					const dataSeasons = { tvSeries: item.seriesId };

					getSeasons(dataSeasons, (res) => {

						let season = res[0].season;
						for (let i = 0; i < res.length; i++) {
							if (res[i].season > season) season = res[i].season;
						}

						const dataEpisodes = {
							seriesName: item.displayName,
							tvSeries: item.seriesId,
							season: season
						};

						getAllEpisodes(dataEpisodes, (res) => {
							itemsProcessed++;
							episodes = episodes.concat(res);
							if (itemsProcessed === snapshot.docs.length) {
								console.log("Finish");
								callback(episodes);
							}
						});
					});
				});
			}
		});
};

const getAllEpisodes = (data, callback) => {
	if (data.season > 1) {
		for (let i = data.season - 1; i <= data.season; i++) {

			var items = 0;
			var episodes = [];

			const dataf = {
				seriesName: data.seriesName,
				tvSeries: data.tvSeries,
				season: i
			};

			getEpisodes(dataf, (res) => {
				items++;
				episodes = episodes.concat(res);
				if (items == data.season || items == 2) {
					callback(episodes);
				}
			});
		}
	} else {
		getEpisodes(data, (res) => {
			callback(episodes);
		});
	}
};

const fetchEpisodes = (data, callback) => {
	const url = `https://api.themoviedb.org/3/tv/${data.tvSeries}/season/${data.season}?api_key=${process.env.tmdbKey}`;

	request(url, (error, response, html) => {
		if (error) console.log(error);
		const json = JSON.parse(html);

		console.log(json);

		const res = [];
		for (let i = 0; i < json.episodes.length; i++) {
			let image = null;
			if (json.episodes[i].still_path) {
				image = `https://image.tmdb.org/t/p/w454_and_h254_bestv2${json.episodes[i].still_path}`;
			}

			const episode = {
				seriesId: data.tvSeries,
				seriesName: data.seriesName,
				title: json.episodes[i].name,
				date: json.episodes[i].air_date,
				image: image,
				season: json.episodes[i].season_number,
				number: json.episodes[i].episode_number
			};

			res.push(episode);
		}
		callback(res);
	});
};

const getEpisodes = (req, res) => {
	const data = {
		tvSeries: req.params.tvSeries,
		season: req.params.season
	};

	console.log(data);

	fetchEpisodes(data, (response) => {
		res.json(response);
	});
};

module.exports = {
	getSearch: (req, res) => middleware(req, res, getSearch, { token: true }),
	addSeries: (req, res) => middleware(req, res, addSeries, { token: true }),
	getSeasons: (req, res) => middleware(req, res, getSeasons, { token: true }),
	getEpisodes,
};
