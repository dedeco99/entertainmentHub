const { middleware, response } = require("./utils/middleware");
const errors = require("./utils/errors");
const { api } = require("./utils/request");
const { toObjectId, diff } = require("./utils/utils");

const { scheduleNotifications } = require("./notifications");

const Series = require("./models/series");
const Episode = require("./models/episode");

// eslint-disable-next-line complexity
async function fetchEpisodes(series) {
	const episodesToAdd = [];
	const episodesToUpdate = [];
	const notificationsToAdd = [];

	let url = `https://api.themoviedb.org/3/tv/${series._id}?api_key=${process.env.tmdbKey}`;

	const res = await api({ method: "get", url });
	let json = res.data;

	console.log(`${series.displayNames[0]} - ${res.status} started`);

	let seasons = [];
	if (json.seasons) {
		seasons = json.seasons.map(season => season.season_number);
	}

	const seasonsPromises = [];
	for (const season of seasons) {
		url = `https://api.themoviedb.org/3/tv/${series._id}/season/${season}?api_key=${process.env.tmdbKey}`;

		seasonsPromises.push(api({ method: "get", url }));
	}

	seasons = await Promise.all(seasonsPromises);

	for (const season of seasons) {
		json = season.data;

		if (json.episodes && json.episodes.length) {
			for (const episode of json.episodes) {
				// eslint-disable-next-line no-await-in-loop
				const episodeExists = await Episode.findOne({
					seriesId: series._id,
					season: episode.season_number,
					number: episode.episode_number,
				}).lean();

				if (!episodeExists) {
					const newEpisode = new Episode({
						seriesId: series._id,
						title: episode.name,
						image: episode.still_path ? `https://image.tmdb.org/t/p/w454_and_h254_bestv2${episode.still_path}` : "",
						season: episode.season_number,
						number: episode.episode_number,
						overview: episode.overview,
						date: episode.air_date,
					});
					episodesToAdd.push(newEpisode);

					if (diff(newEpisode.date, "days") <= 5) {
						notificationsToAdd.push({
							dateToSend: newEpisode.date,
							notificationId: episode.id,
							type: "tv",
							info: {
								seriesId: series._id,
								season: newEpisode.season,
								number: newEpisode.number,
							},
						});
					}

					console.log(`- S${episode.season_number}E${episode.episode_number} created`);
				} else if (
					(episode.still_path && !episodeExists.image) ||
					episodeExists.title !== episode.name
				) {
					episodesToUpdate.push(Episode.updateOne({
						seriesId: series._id,
						season: episode.season_number,
						number: episode.episode_number,
					}, {
						title: episode.name,
						overview: episode.overview,
						image: episode.still_path ? `https://image.tmdb.org/t/p/w454_and_h254_bestv2${episode.still_path}` : "",
					}));

					console.log(`- S${episode.season_number}E${episode.episode_number} edited`);
				}
			}
		}
	}

	if (episodesToAdd.length) await Episode.insertMany(episodesToAdd);
	if (episodesToUpdate.length) await Promise.all(episodesToUpdate);
	if (notificationsToAdd.length) await scheduleNotifications(notificationsToAdd);

	console.log(`${series.displayNames[0]} finished`);

	return true;
}

async function cronjob() {
	const seriesList = await Series.aggregate([
		{
			$group: {
				_id: "$seriesId",
				displayNames: { $push: "$displayName" },
				users: { $push: "$user" },
			},
		},
		{ $sort: { _id: 1 } },
	]);

	const seriesPromises = [];
	for (const series of seriesList) {
		seriesPromises.push(fetchEpisodes(series));
	}

	await Promise.all(seriesPromises);

	console.log("Cronjob finished");

	return true;
}

async function getSeries(event) {
	const { user } = event;

	const series = await Series.find({ user: user._id }).sort({ displayName: 1 }).lean();

	return response(200, "Series found", series);
}

async function getEpisodes(event) {
	const { params, query, user } = event;
	const { id } = params;
	const { page, filter } = query;

	const userSeries = await Series.find({ user: user._id }).sort({ displayName: 1 }).lean();

	const seriesIds = userSeries.map(s => s.seriesId);

	const episodeQuery = { seriesId: { $in: seriesIds } };
	const sortQuery = { date: -1, seriesId: -1, number: -1 };
	if (filter === "passed") {
		episodeQuery.date = { $lte: new Date() };
	} else if (filter === "future") {
		episodeQuery.date = { $gt: new Date() };
		sortQuery.date = 1;
	}

	let episodes = [];
	if (id === "all") {
		episodes = await Episode.aggregate([
			{
				$match: episodeQuery,
			},
			{
				$lookup: {
					from: "series",
					let: { seriesId: "$seriesId" },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $eq: ["$seriesId", "$$seriesId"] },
										{ $eq: ["$user", toObjectId(user._id)] },
									],
								},
							},
						},
					],
					as: "seriesId",
				},
			},
			{
				$unwind: "$seriesId",
			},
			{
				$sort: sortQuery,
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
				$match: { seriesId: id },
			},
			{
				$sort: { number: -1 },
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

async function getSearch(event) {
	const { params, query } = event;
	const { search } = params;
	const { page } = query;

	if (!page && page !== "0") return response(400, "Missing page in query");

	const url = `https://api.themoviedb.org/3/search/tv?query=${search}${`&page=${Number(page) + 1}`}&api_key=${process.env.tmdbKey}`;

	const res = await api({ method: "get", url });
	const json = res.data;

	const series = json.results.map(s => ({
		id: s.id,
		displayName: s.name,
		image: `https://image.tmdb.org/t/p/w300_and_h450_bestv2${s.poster_path}`,
	}));

	return response(200, "Series found", series);
}

async function getPopular(event) {
	const { query } = event;
	const { page } = query;

	if (!page && page !== "0") return response(400, "Missing page in query");

	const url = `https://api.themoviedb.org/3/tv/popular?${`page=${Number(page) + 1}`}&api_key=${process.env.tmdbKey}`;

	const res = await api({ method: "get", url });
	const json = res.data;

	const series = json.results.map(s => ({
		id: s.id,
		displayName: s.name,
		image: `https://image.tmdb.org/t/p/w300_and_h450_bestv2${s.poster_path}`,
	}));

	return response(200, "Series found", series);
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
		await fetchEpisodes({
			_id: newSeries.seriesId,
			displayNames: [newSeries.name],
			users: [newSeries.user],
		});
	}

	return response(201, "Series has been added", newSeries);
}

async function editSeries(event) {
	const { params, body } = event;
	const { id } = params;
	const { displayName } = body;

	const seriesExists = await Series.findOne({ _id: id }).lean();

	if (!seriesExists) return errors.notFound;

	const series = await Series.findOneAndUpdate({ _id: id }, { displayName }, { new: true }).lean();

	if (!series) return errors.notFound;

	return response(200, "Series has been updated", series);
}

async function deleteSeries(event) {
	const { params } = event;
	const { id } = params;

	let series = null;
	try {
		series = await Series.findOneAndDelete({ _id: id });
	} catch (e) {
		return errors.notFound;
	}

	if (!series) return errors.notFound;

	return response(200, "Series has been deleted", series);
}

module.exports = {
	cronjob,
	getSeries: (req, res) => middleware(req, res, getSeries, ["token"]),
	getEpisodes: (req, res) => middleware(req, res, getEpisodes, ["token"]),
	getSearch: (req, res) => middleware(req, res, getSearch, ["token"]),
	getPopular: (req, res) => middleware(req, res, getPopular, ["token"]),
	addSeries: (req, res) => middleware(req, res, addSeries, ["token"]),
	editSeries: (req, res) => middleware(req, res, editSeries, ["token"]),
	deleteSeries: (req, res) => middleware(req, res, deleteSeries, ["token"]),
};
