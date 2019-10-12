const { get } = require("./request");

const { middleware, response } = require("./utils");

const Series = require("./models/series");

const getSeries = async (event) => {
	const series = await Series.find().lean();

	return response(200, "Series found", series);
};

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

	const seriesExists = await Series.findOne({ seriesId: body.id }).lean();

	if (seriesExists) {
		return response(409, "Series already exists");
	} else {
		const newSeries = new Series({ seriesId: id, displayName, image });
		await newSeries.save();

		const series = await Series.find().lean();

		return response(201, "Series has been added", series);
	}
};

const getSeasons = async (event) => {
	const { params } = event;
	const { series } = params;

	const url = `https://api.themoviedb.org/3/tv/${series}?api_key=${process.env.tmdbKey}`;

	const res = await get(url);
	const json = JSON.parse(res);

	let seasons = [];
	if (json.seasons) {
		seasons = json.seasons.map(season => {
			return {
				id: season.id,
				season: season.season_number,
			};
		});
	}

	return response(200, 'Seasons found', seasons);
};

const getEpisodes = async (event) => {
	const { params } = event;
	const { series, season } = params;

	const url = `https://api.themoviedb.org/3/tv/${series}/season/${season}?api_key=${process.env.tmdbKey}`;

	const res = await get(url);
	const json = JSON.parse(res);

	let episodes = [];
	if (json.episodes) {
		episodes = json.episodes.map(episode => {
			let image = null;
			if (episode.still_path) {
				image = `https://image.tmdb.org/t/p/w454_and_h254_bestv2${episode.still_path}`;
			}

			return {
				seriesId: series,
				title: episode.name,
				date: episode.air_date,
				image: image,
				season: episode.season_number,
				number: episode.episode_number
			};
		});
	}

	return response(200, 'Episodes found', episodes);
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

module.exports = {
	getSeries: (req, res) => middleware(req, res, getSeries, { token: true }),
	getSearch: (req, res) => middleware(req, res, getSearch, { token: true }),
	addSeries: (req, res) => middleware(req, res, addSeries, { token: true }),
	getSeasons: (req, res) => middleware(req, res, getSeasons, { token: true }),
	getEpisodes: (req, res) => middleware(req, res, getEpisodes, { token: true }),
};
