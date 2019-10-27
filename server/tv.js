const { get } = require("./request");

const { middleware, response } = require("./utils");

const Series = require("./models/series");
const Episode = require("./models/episode");

const getSeries = async (event) => {
	const { user } = event;

	const series = await Series.find({ user: user._id }).lean();

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
			image: `https://image.tmdb.org/t/p/w300_and_h450_bestv2${series.poster_path}`,
		};
	});

	return response(200, "Series found", series);
};

const addSeries = async (event) => {
	const { body, user } = event;
	const { id, displayName, image } = body;

	const seriesExists = await Series.findOne({ user: user._id, seriesId: body.id }).lean();

	if (seriesExists) return response(409, "Series already exists");

	const newSeries = new Series({ user: user._id, seriesId: id, displayName, image });
	await newSeries.save();

	const series = await Series.find({ user: user._id }).lean();

	return response(201, "Series has been added", series);
};

const getEpisodes = async (event) => {
	const { params, user } = event;
	const { series } = params;

	const userSeries = await Series.find({ user: user._id }).lean();

	const seriesIds = userSeries.map(s => s.seriesId);

	let episodes = [];
	if (series === "all") {
		episodes = await Episode.aggregate([
			{
				$match: { seriesId: { $in: seriesIds } },
			},
			{
				$sort: { date: -1 },
			},
		]);
	} else {
		episodes = await Episode.aggregate([
			{
				$match: { seriesId: series },
			},
			{
				$group: {
					_id: "$season",
					episodes: { $push: "$$ROOT" },
				},
			},
			{
				$sort: { _id: 1 },
			},
		]);
	}

	return response(200, "Episodes found", episodes);
};

const cronjob = async (event) => {
	const { user } = event;
	const seriesList = await Series.find({ user: user._id }).lean();

	for (const series of seriesList) {
		let url = `https://api.themoviedb.org/3/tv/${series.seriesId}?api_key=${process.env.tmdbKey}`;

		let res = await get(url);
		let json = JSON.parse(res);

		let seasons = [];
		if (json.seasons) {
			seasons = json.seasons.map(season => {
				return {
					id: season.id,
					season: season.season_number,
				};
			});
		}

		let lastSeason = seasons[seasons.length - 1].season;
		let checkPreviousSeason = true;
		while (checkPreviousSeason && lastSeason >= 0) {
			console.log(checkPreviousSeason, lastSeason);
			url = `https://api.themoviedb.org/3/tv/${series.seriesId}/season/${lastSeason}?api_key=${process.env.tmdbKey}`;

			res = await get(url);
			json = JSON.parse(res);

			checkPreviousSeason = false;
			lastSeason--;

			if (json.episodes) {
				json.episodes = json.episodes.reverse();
				for (const episode of json.episodes) {
					const episodeExists = await Episode.findOne({
						seriesId: series.seriesId,
						season: episode.season_number,
						number: episode.episode_number,
					}).lean();

					if (!episodeExists) {
						const newEpisode = new Episode({
							seriesId: series.seriesId,
							title: episode.name,
							image: episode.still_path ? `https://image.tmdb.org/t/p/w454_and_h254_bestv2${episode.still_path}` : "",
							season: episode.season_number,
							number: episode.episode_number,
							overview: episode.overview,
							date: episode.air_date,
						});
						await newEpisode.save();
						console.log(episode.season_number, episode.episode_number, "created");
						checkPreviousSeason = true;
					} else if (!episodeExists.image && episode.still_path) {
						await Episode.updateOne({
							seriesId: series.seriesId,
							season: episode.season_number,
							number: episode.episode_number,
						}, {
							image: `https://image.tmdb.org/t/p/w454_and_h254_bestv2${episode.still_path}`,
						});
						console.log(episode.season_number, episode.episode_number, "edited");
					}
				}
			}
		}
	}

	return response(200, "Episodes found", []);
};

module.exports = {
	getSeries: (req, res) => middleware(req, res, getSeries, { token: true }),
	getSearch: (req, res) => middleware(req, res, getSearch, { token: true }),
	addSeries: (req, res) => middleware(req, res, addSeries, { token: true }),
	getSeasons: (req, res) => middleware(req, res, getSeasons, { token: true }),
	getEpisodes: (req, res) => middleware(req, res, getEpisodes, { token: true }),
	cronjob: (req, res) => middleware(req, res, cronjob, { token: true }),
};
