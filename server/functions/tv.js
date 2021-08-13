/* eslint-disable max-lines */
const cheerio = require("cheerio");
const dayjs = require("dayjs");

const { response, api } = require("../utils/request");
const { toObjectId, formatDate, diff } = require("../utils/utils");

const { addScheduledNotifications } = require("./scheduledNotifications");

const Subscription = require("../models/subscription");
const Episode = require("../models/episode");
const ScheduledNotification = require("../models/scheduledNotification");

const finaleQuery = [
	{
		$lookup: {
			from: "episodes",
			let: { seriesId: "$seriesId", season: "$season" },
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [{ $eq: ["$seriesId", "$$seriesId"] }, { $eq: ["$season", "$$season"] }],
						},
					},
				},
				{
					$sort: { number: -1 },
				},
				{
					$limit: 1,
				},
			],
			as: "finale",
		},
	},
	{ $unwind: "$finale" },
	{
		$addFields: {
			finale: {
				$cond: [{ $eq: ["$finale.number", "$number"] }, true, false],
			},
		},
	},
];

const watchedQuery = user => [
	{
		$lookup: {
			from: "subscriptions",
			let: { seriesId: "$seriesId" },
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [
								{ platform: "tv" },
								{ $eq: ["$externalId", "$$seriesId"] },
								{ $eq: ["$user", toObjectId(user._id)] },
							],
						},
					},
				},
			],
			as: "series",
		},
	},
	{ $unwind: "$series" },
	{
		$addFields: {
			watched: {
				$cond: [
					{
						$in: [
							{ $concat: ["S", { $toString: "$season" }, "E", { $toString: "$number" }] },
							"$series.watched.key",
						],
					},
					true,
					false,
				],
			},
		},
	},
];

async function getEpisodeNumbers(series, user) {
	const seriesIds = series.map(s => s.externalId.toString());
	const seriesTotals = await Episode.aggregate([
		{ $match: { seriesId: { $in: seriesIds } } },
		...watchedQuery(user),
		{
			$group: {
				_id: "$seriesId",
				watched: { $sum: { $cond: [{ $eq: ["$watched", true] }, 1, 0] } },
				total: { $sum: 1 },
			},
		},
	]);

	for (const serie of series) {
		const seriesFound = seriesTotals.find(s => s._id === serie.externalId.toString());

		if (seriesFound) {
			serie.numTotal = seriesFound.total;
			serie.numWatched = seriesFound.watched;
			serie.numToWatch = seriesFound.total - seriesFound.watched;
		}
	}

	return series;
}

async function sendSocketUpdate(type, subscriptions, user) {
	if (global.sockets[user._id]) {
		const updatedSubscriptions = await getEpisodeNumbers(subscriptions, user);

		for (const socket of global.sockets[user._id]) {
			socket.emit(
				type === "edit" ? "editSubscription" : "setSubscriptions",
				type === "edit" ? updatedSubscriptions[0] : updatedSubscriptions,
			);
		}
	}
}

// eslint-disable-next-line complexity, max-lines-per-function
async function fetchEpisodes(series, user) {
	const episodesToAdd = [];
	const episodesToUpdate = [];
	const notificationsToAdd = [];

	let url = `https://api.themoviedb.org/3/tv/${series._id}?api_key=${process.env.tmdbKey}`;

	const res = await api({ method: "get", url });
	let json = res.data;

	console.log(`${series.displayName} - ${res.status} started`);

	let seasons = [];
	if (json.seasons) {
		seasons = json.seasons.map(season => season.season_number).filter(season => season);
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
				const episodeExists = await Episode.findOne({
					seriesId: series._id,
					season: episode.season_number,
					number: episode.episode_number,
				}).lean();

				if (!episodeExists) {
					const newEpisode = new Episode({
						seriesId: series._id,
						title: episode.name,
						image: episode.still_path
							? `https://image.tmdb.org/t/p/w454_and_h254_bestv2${episode.still_path}`
							: "",
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

					console.log(`${series.displayName} - S${episode.season_number}E${episode.episode_number} created`);
				} else if (
					(!episodeExists.image && episode.still_path) ||
					episodeExists.title !== episode.name ||
					formatDate(episodeExists.date, "YYYY-MM-DD") !== formatDate(episode.air_date, "YYYY-MM-DD")
				) {
					episodesToUpdate.push(
						Episode.updateOne(
							{
								seriesId: series._id,
								season: episode.season_number,
								number: episode.episode_number,
							},
							{
								title: episode.name,
								overview: episode.overview,
								image: episode.still_path
									? `https://image.tmdb.org/t/p/w454_and_h254_bestv2${episode.still_path}`
									: "",
								date: episode.air_date,
							},
						),
					);

					episodesToUpdate.push(
						ScheduledNotification.updateOne(
							{
								"info.seriesId": series._id,
								"info.season": episode.season_number,
								"info.number": episode.episode_number,
							},
							{
								dateToSend: episode.air_date,
							},
						),
					);

					console.log(`${series.displayName} - S${episode.season_number}E${episode.episode_number} edited`);
				}
			}
		}
	}

	if (episodesToAdd.length) await Episode.insertMany(episodesToAdd);
	if (episodesToUpdate.length) await Promise.all(episodesToUpdate);
	if (notificationsToAdd.length) await addScheduledNotifications(notificationsToAdd);

	if (user) {
		sendSocketUpdate(
			"edit",
			[
				await Subscription.findOne({
					user: user._id,
					platform: "tv",
					externalId: series._id,
				}).lean(),
			],
			user,
		);
	}

	console.log(`${series.displayName} finished`);

	return true;
}

async function cronjob() {
	const seriesList = await Subscription.aggregate([
		{ $match: { platform: "tv" } },
		{
			$group: {
				_id: "$externalId",
				displayName: { $first: "$displayName" },
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

// eslint-disable-next-line max-lines-per-function
async function getEpisodes(event) {
	const { params, query, user } = event;
	const { id } = params;
	const { page, filter } = query;

	const userSeries = await Subscription.find({ active: true, user: user._id, platform: "tv" })
		.sort({ displayName: 1 })
		.lean();

	const seriesIds = userSeries.map(s => s.externalId);

	const episodeQuery = { seriesId: { $in: seriesIds } };
	const afterQuery = { watched: { $ne: null } };
	const sortQuery = { date: -1, seriesId: -1, number: -1 };
	if (filter === "passed") {
		episodeQuery.date = { $lte: new Date() };
	} else if (filter === "future") {
		episodeQuery.date = { $gt: new Date() };
		sortQuery.date = 1;
	} else if (filter === "watched") {
		afterQuery.watched = true;
	} else if (filter === "toWatch") {
		episodeQuery.date = { $lte: new Date() };
		afterQuery.watched = false;
	}

	let episodes = [];
	if (id === "all") {
		if (filter === "queue") {
			episodes = await Episode.aggregate([
				{ $match: episodeQuery },
				...watchedQuery(user),
				{ $match: { watched: false } },
				{ $sort: { season: 1, number: 1 } },
				{ $group: { _id: "$seriesId", episodes: { $first: "$$ROOT" } } },
				{ $replaceRoot: { newRoot: { $mergeObjects: ["$episodes", "$$ROOT"] } } },
				{ $sort: { "series.watched.date": -1 } },
				{
					$project: {
						_id: "$episodes._id",
						title: 1,
						image: 1,
						season: 1,
						number: 1,
						date: 1,
						series: 1,
						lastWatched: { $last: "$series.watched" },
					},
				},
				{ $project: { "series.watched": 0 } },
			]);
		} else {
			episodes = await Episode.aggregate([
				{ $match: episodeQuery },
				{ $sort: sortQuery },
				...watchedQuery(user),
				...finaleQuery,
				{ $match: afterQuery },
				{ $skip: page ? page * 50 : 0 },
				{ $limit: 50 },
			]);
		}
	} else {
		episodes = await Episode.aggregate([
			{ $match: { seriesId: id } },
			{ $sort: { number: -1 } },
			...watchedQuery(user),
			...finaleQuery,
			{ $group: { _id: "$season", episodes: { $push: "$$ROOT" } } },
			{ $sort: { _id: 1 } },
		]);
	}

	return response(200, "GET_EPISODES", episodes);
}

async function getSearch(event) {
	const { params, query } = event;
	const { search } = params;
	const { page } = query;

	if (!page && page !== "0") return response(400, "Missing page in query");

	const url = `https://api.themoviedb.org/3/search/tv?query=${search}${`&page=${Number(page) + 1}`}&api_key=${
		process.env.tmdbKey
	}`;

	const res = await api({ method: "get", url });
	const json = res.data;

	const promises = json.results.map(s =>
		api({
			method: "get",
			url: `https://api.themoviedb.org/3/tv/${s.id}/external_ids?api_key=${process.env.tmdbKey}`,
		}),
	);

	const tmdbSeries = await Promise.all(promises);

	const series = json.results.map((s, i) => ({
		externalId: s.id.toString(),
		displayName: s.name,
		image: s.poster_path ? `https://image.tmdb.org/t/p/w300_and_h450_bestv2${s.poster_path}` : "",
		imdbId: tmdbSeries[i].data.imdb_id,
		year: dayjs(s.first_air_date).get("year"),
		rating: s.vote_average,
	}));

	return response(200, "GET_SERIES", series);
}

function getTrend(trend) {
	const isUp = trend.find(".global-sprite.titlemeter.up").length;

	const formattedTrend = `${isUp ? "+" : "-"}${trend.text().replace(/\n/g, "").replace("(", "").replace(")", "")}`;

	return isNaN(formattedTrend) ? 0 : formattedTrend;
}

async function getPopular(event) {
	const { query, user } = event;
	const { page, source, type } = query;

	if (!page && page !== "0") return response(400, "Missing page in query");

	let series = [];
	if (source === "imdb") {
		let useCache = true;

		if (!global.cache[type].popular.length || diff(global.cache[type].lastUpdate, "hours") > 24) {
			useCache = false;
		}

		if (!useCache) {
			const url = `https://www.imdb.com/chart/${type === "movies" ? "moviemeter" : "tvmeter"}`;

			const res = await api({ method: "get", url, headers: { "accept-language": "en-US" } });
			const $ = cheerio.load(res.data);

			const infos = $(".titleColumn")
				.toArray()
				.map(elem => {
					const year = $(elem)
						.find(".secondaryInfo")
						.text()
						.match(/\((.*)\)/);
					return {
						id: $(elem).find("a").attr("href").split("/")[2],
						name: $(elem).find("a").text(),
						year: Number(year ? year[1] : null),
						rank: Number($(elem).find(".velocity").text().split("\n")[0]),
						// trend: getTrend($(elem).find(".velocity").find(".secondaryInfo")),
					};
				});

			const ratings = $(".ratingColumn.imdbRating")
				.toArray()
				.map(elem => $(elem).find("strong").text());

			const promises = infos.map(i =>
				api({
					method: "get",
					url: `https://api.themoviedb.org/3/find/${i.id}?external_source=imdb_id&api_key=${process.env.tmdbKey}`,
				}),
			);

			const tmdbSeries = await Promise.all(promises);

			for (let i = 0; i < infos.length; i++) {
				series.push({
					externalId: tmdbSeries[i].data.tv_results.length
						? tmdbSeries[i].data.tv_results[0].id.toString()
						: tmdbSeries[i].data.movie_results.length
						? tmdbSeries[i].data.movie_results[0].id.toString()
						: null,
					imdbId: infos[i].id,
					displayName: infos[i].name,
					image: tmdbSeries[i].data.tv_results.length
						? `https://image.tmdb.org/t/p/w300_and_h450_bestv2${tmdbSeries[i].data.tv_results[0].poster_path}`
						: tmdbSeries[i].data.movie_results.length
						? `https://image.tmdb.org/t/p/w300_and_h450_bestv2${tmdbSeries[i].data.movie_results[0].poster_path}`
						: "",
					year: infos[i].year,
					rank: infos[i].rank,
					trend: infos[i].trend,
					rating: ratings[i],
				});
			}

			global.cache[type].popular = series;
		}

		series = global.cache[type].popular.slice(Number(page) * 20, Number(page) * 20 + 20);
	} else {
		const url = `https://api.themoviedb.org/3/tv/popular?${`page=${Number(page) + 1}`}&api_key=${
			process.env.tmdbKey
		}`;

		const res = await api({ method: "get", url });
		const json = res.data;

		series = json.results.map(s => ({
			externalId: s.id.toString(),
			displayName: s.name,
			image: s.poster_path ? `https://image.tmdb.org/t/p/w300_and_h450_bestv2${s.poster_path}` : "",
		}));
	}

	return response(200, "GET_SERIES", series);
}

async function getProviders(event) {
	const { query } = event;
	const { type, search } = query;

	const providersRes = await api({
		method: "get",
		url: "https://apis.justwatch.com/content/providers/locale/pt_PT",
	});

	const justWatchRes = await api({
		method: "get",
		url: `https://apis.justwatch.com/content/titles/pt_PT/popular?body={"page_size":1,"page":1,"query":"${search}","content_types":["${
			type === "tv" ? "show" : "movie"
		}"]}`,
	});

	const providers = [];
	if (justWatchRes.data.items.length) {
		const offers = justWatchRes.data.items[0].offers;

		if (offers) {
			const existingLinks = [];
			for (const offer of offers) {
				if (!existingLinks.includes(offer.urls.standard_web)) {
					offer.icon = `https://images.justwatch.com${providersRes.data
						.find(p => p.id === offer.provider_id)
						.icon_url.replace("/{profile}", "")}/s100`;

					providers.push({ url: offer.urls.standard_web, icon: offer.icon });

					existingLinks.push(offer.urls.standard_web);
				}
			}
		}
	}

	/*
	const justWatchDetailRes = await api({
		method: "get",
		url: `https://apis.justwatch.com/content/titles/show/${justWatchRes.data.items[0].id}/locale/pt_PT`,
	});
	*/

	return response(200, "GET_PROVIDERS", providers);
}

module.exports = {
	fetchEpisodes,
	cronjob,
	getEpisodeNumbers,
	sendSocketUpdate,
	getEpisodes,
	getSearch,
	getPopular,
	getProviders,
};
