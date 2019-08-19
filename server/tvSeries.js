const request = require("request");

const database = require("./database");

const fetchSeasons = (data, callback) => {
	const url = `https://api.themoviedb.org/3/tv/${data.tvSeries}?api_key=${process.env.tmdbKey}`;

	request(url, (error, response, html) => {
		if (error) console.log(error);
		const json = JSON.parse(html);

		const res = [];
		for (let i = 0; i < json.seasons.length; i++) {
			const season = {
				id: json.id,
				season: json.seasons[i].season_number
			};
			res.push(season);
		}
		callback(res);
	});
};

var getAllSeries = (data, callback) => {
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

const getSeasons = (req, res) => {
	const data = {
		tvSeries: req.params.tvSeries,
		userId: req.query.userId
	};

	console.log(data);

	if (data.tvSeries === "all") {
		getAllSeries(data, (response) => {
			res.json(response.sort((a, b) => {
				return new Date(b.date) - new Date(a.date) || b.series - a.series || b.season - a.season || b.number - a.number;
			}));
		});
	} else {
		fetchSeasons(data, (response) => {
			res.json(response);
		});
	}
};

var getAllEpisodes = (data, callback) => {
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

var fetchEpisodes = (data, callback) => {
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

const fetchSearch = (data, callback) => {
	const url = `https://api.themoviedb.org/3/search/tv?query=${data.search}&api_key=${process.env.tmdbKey}`;

	request(url, (error, response, html) => {
		if (error) console.log(error);
		const json = JSON.parse(html);

		const res = [];
		for (let i = 0; i < json.results.length; i++) {
			const series = {
				id: json.results[i].id,
				displayName: json.results[i].name,
				image: `https://image.tmdb.org/t/p/w300_and_h450_bestv2${json.results[i].poster_path}`
			};
			res.push(series);
		}
		callback(res);
	});
};

const getSearch = (req, res) => {
	const data = {
		search: req.params.search,
		userId: req.query.userId
	};

	fetchSearch(data, (response) => {
		res.json(response);
	});
};

module.exports = {
	getSeasons,
	getEpisodes,
	getSearch
};
