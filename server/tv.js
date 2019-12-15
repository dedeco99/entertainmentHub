const { get } = require("./request");

const { middleware, response } = require("./utils");

const Series = require("./models/series");
const Episode = require("./models/episode");

async function getSeries(event) {
	const { user } = event;

	const series = await Series.find({ user: user._id }).sort({ displayName: 1 }).lean();

	return response(200, "Series found", series);
}

async function getSearch(event) {
	const { params, query } = event;
	const { search } = params;
	const { page } = query;

	if (!page && page !== "0") return response(400, "Missing page in query");

	const url = `https://api.themoviedb.org/3/search/tv?query=${search}${`&page=${Number(page) + 1}`}&api_key=${process.env.tmdbKey}`;

	const res = await get(url);
	const json = JSON.parse(res.data);

	const series = json.results.map(series => ({
		id: series.id,
		displayName: series.name,
		image: `https://image.tmdb.org/t/p/w300_and_h450_bestv2${series.poster_path}`,
	}));

	return response(200, "Series found", series);
}

async function getPopular(event) {
	const { query } = event;
	const { page } = query;

	if (!page && page !== "0") return response(400, "Missing page in query");

	const url = `https://api.themoviedb.org/3/tv/popular?${`page=${Number(page) + 1}`}&api_key=${process.env.tmdbKey}`;

	const res = await get(url);
	const json = JSON.parse(res.data);

	const series = json.results.map(series => ({
		id: series.id,
		displayName: series.name,
		image: `https://image.tmdb.org/t/p/w300_and_h450_bestv2${series.poster_path}`,
	}));

	return response(200, "Series found", series);
}

async function cronjob(event) {
	const { user, series } = event;

	let seriesList = [];
	if (series) {
		seriesList.push(series);
	} else {
		seriesList = await Series.find({ user: user._id }).sort({ displayName: 1 }).lean();
	}

	for (const series of seriesList) {
		let url = `https://api.themoviedb.org/3/tv/${series.seriesId}?api_key=${process.env.tmdbKey}`;

		let res = await get(url);
		let json = res.data;

		console.log(`${series.displayName} - ${res.status}`);

		let seasons = [];
		if (json.seasons) {
			seasons = json.seasons.map(season => season.season_number);
		}

		for (const season of seasons) {
			url = `https://api.themoviedb.org/3/tv/${series.seriesId}/season/${season}?api_key=${process.env.tmdbKey}`;

			res = await get(url);
			json = res.data;

			if (json.episodes && json.episodes.length) {
				const episodesToAdd = [];
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
						episodesToAdd.push(newEpisode);

						console.log(`- S${episode.season_number}E${episode.episode_number} created`);
					} else if (!episodeExists.image && episode.still_path) {
						await Episode.updateOne({
							seriesId: series.seriesId,
							season: episode.season_number,
							number: episode.episode_number,
						}, {
							image: `https://image.tmdb.org/t/p/w454_and_h254_bestv2${episode.still_path}`,
						});

						console.log(`- S${episode.season_number}E${episode.episode_number} edited`);
					}
				}

				if (episodesToAdd.length) {
					Episode.insertMany(episodesToAdd);
				}
			}
		}
	}

	return response(200, "Episodes found", []);
}

async function addSeries(event) {
	const { body, user } = event;
	const { id, displayName, image } = body;

	const seriesExists = await Series.findOne({ user: user._id, seriesId: id }).lean();

	if (seriesExists) return response(409, "Series already exists");

	const seriesPopulated = await Series.findOne({ seriesId: id }).lean();

	const newSeries = new Series({ user: user._id, seriesId: id, displayName, image });
	await newSeries.save();

	if (!seriesPopulated) {
		await cronjob({ series: newSeries });
	}

	const series = await Series.find({ user: user._id }).sort({ displayName: 1 }).lean();

	return response(201, "Series has been added", series);
}

async function editSeries(event) {
	const { params, body, user } = event;
	const { id } = params;
	const { displayName } = body;

	const seriesExists = await Series.findOne({ user: user._id, seriesId: id }).lean();

	if (!seriesExists) return response(404, "Series doesn't exist");

	await Series.updateOne({ seriesId: id }, { displayName }).lean();

	const series = await Series.find({ user: user._id }).sort({ displayName: 1 }).lean();

	return response(200, "Series has been updated", series);
}

async function deleteSeries(event) {
	const { params, user } = event;
	const { id } = params;

	const seriesExists = await Series.findOneAndDelete({ user: user._id, seriesId: id });

	if (!seriesExists) return response(404, "Series not found");

	const series = await Series.find({ user: user._id }).sort({ displayName: 1 }).lean();

	return response(200, "Series has been deleted", series);
}

async function getEpisodes(event) {
	const { params, query, user } = event;
	const { series } = params;
	const { page, filter } = query;

	const userSeries = await Series.find({ user: user._id }).sort({ displayName: 1 }).lean();

	const seriesIds = userSeries.map(s => s.seriesId);

	const episodeQuery = { seriesId: { $in: seriesIds } };

	if (filter === "passed") {
		episodeQuery.date = { $lte: new Date() };
	} else if (filter === "future") {
		episodeQuery.date = { $gt: new Date() };
	}


	let episodes = [];
	if (series === "all") {
		episodes = await Episode.aggregate([
			{
				$match: episodeQuery,
			},
			{
				$lookup: {
					from: "series",
					localField: "seriesId",
					foreignField: "seriesId",
					as: "seriesId",
				},
			},
			{
				$unwind: "$seriesId",
			},
			{
				$sort: { date: -1 },
			},
			{
				$skip: page ? page * 50 : 0,
			},
			{
				$limit: 50,
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
}

module.exports = {
	getSeries: (req, res) => middleware(req, res, getSeries, ["token"]),
	getSearch: (req, res) => middleware(req, res, getSearch, ["token"]),
	getPopular: (req, res) => middleware(req, res, getPopular, ["token"]),
	addSeries: (req, res) => middleware(req, res, addSeries, ["token"]),
	editSeries: (req, res) => middleware(req, res, editSeries, ["token"]),
	deleteSeries: (req, res) => middleware(req, res, deleteSeries, ["token"]),
	getEpisodes: (req, res) => middleware(req, res, getEpisodes, ["token"]),
	cronjob: (req, res) => middleware(req, res, cronjob, ["token"]),
};
