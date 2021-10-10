const cheerio = require("cheerio");

const { response, api } = require("../utils/request");
const errors = require("../utils/errors");
const { toObjectId, diff } = require("../utils/utils");

const tv = require("./tv");
const twitch = require("./twitch");

const Subscription = require("../models/subscription");
const Asset = require("../models/asset");
const Episode = require("../models/episode");

async function getSubscriptions(event) {
	const { params, user } = event;
	const { platform } = params;

	let subscriptions = await Subscription.find({ active: true, user: user._id, platform })
		.collation({ locale: "en" })
		.sort({ "group.pos": 1, displayName: 1 })
		.lean();

	if (platform === "twitch") {
		const streams = await twitch.getStreams({ user, query: { skipGame: true } });

		subscriptions = subscriptions.map(subscription => {
			const stream = streams.body.data.find(s => s.user === subscription.displayName);

			if (stream) {
				return {
					...subscription,
					viewers: stream.viewers,
					online: stream.live,
				};
			}

			return subscription;
		});
	} else if (platform === "tv") {
		tv.sendSocketUpdate("set", subscriptions, user);
	}

	return response(200, "GET_SUBSCRIPTIONS", subscriptions);
}

// eslint-disable-next-line max-lines-per-function
async function addSubscriptions(event) {
	const { params, body, user } = event;
	const { platform } = params;
	const { subscriptions } = body;

	if (!subscriptions || !subscriptions.length) return errors.requiredFieldsMissing;

	const subscriptionsToAdd = [];
	const subscriptionsToReAdd = [];
	for (const subscription of subscriptions) {
		const { externalId, displayName, group, image, notifications } = subscription;

		if (externalId && displayName) {
			const subscriptionExists = await Subscription.findOne({ user: user._id, platform, externalId }).lean();

			if (!subscriptionExists) {
				subscriptionsToAdd.push(
					new Subscription({
						user: user._id,
						platform,
						externalId,
						displayName,
						group,
						image,
						notifications,
					}),
				);
			} else if (!subscriptionExists.active) {
				subscriptionsToReAdd.push(
					await Subscription.findOneAndUpdate(
						{ _id: subscriptionExists._id },
						{ active: true },
						{ new: true },
					).lean(),
				);
			}

			if (platform === "tv") {
				const assetExists = await Asset.findOne({ platform, externalId }).lean();

				if (!assetExists) {
					let url = `https://api.themoviedb.org/3/tv/${externalId}?append_to_response=external_ids,images&api_key=${process.env.tmdbKey}`;

					let res = await api({ method: "get", url });
					const json = res.data;

					url = `https://www.imdb.com/title/${json.external_ids.imdb_id}`;

					res = await api({ method: "get", url, headers: { "accept-language": "en-US" } });
					const $ = cheerio.load(res.data);

					const rating = $(".AggregateRatingButton__RatingScore-sc-1ll29m0-1.iTLWoV")
						.toArray()
						.map(elem => $(elem).text())[0];

					res = await tv.getProviders({ query: { type: "tv", search: displayName } });

					const providers = res.body.data;

					const asset = new Asset({
						platform,
						externalId,
						displayName,
						image,
						genres: json.genres.map(g => ({ ...g, externalId: g.id })),
						firstDate: json.first_air_date,
						lastDate: json.last_air_date,
						status: json.status,
						episodeRunTime: json.episode_run_time[0],
						tagline: json.tagline,
						overview: json.overview,
						rating,
						languages: json.spoken_languages.map(l => l.iso_639_1),
						backdrops: json.images.backdrops.map(
							b => `https://image.tmdb.org/t/p/w1280_and_h720_bestv2${b.file_path}`,
						),
						providers,
					});

					await asset.save();
				}

				const seriesPopulated = await Subscription.findOne({ active: true, platform, externalId }).lean();

				if (!seriesPopulated) tv.fetchEpisodes({ _id: externalId, displayName }, user);
			}
		}
	}

	try {
		await Subscription.insertMany(subscriptionsToAdd);
	} catch (err) {
		console.log(err);
	}

	if (platform === "tv") {
		tv.sendSocketUpdate("edit", JSON.parse(JSON.stringify(subscriptionsToAdd.concat(subscriptionsToReAdd))), user);
	}

	return response(201, "ADD_SUBSCRIPTIONS", subscriptionsToAdd);
}

async function editSubscription(event) {
	const { params, body, user } = event;
	const { id } = params;
	const { displayName, group, notifications } = body;

	let subscription = null;
	try {
		subscription = await Subscription.findOneAndUpdate(
			{ _id: id },
			{ displayName, group, notifications },
			{ new: true },
		).lean();
	} catch (err) {
		return errors.notFound;
	}

	if (!subscription) return errors.notFound;

	if (subscription.platform === "tv") {
		tv.sendSocketUpdate("edit", [subscription], user);
	}

	return response(200, "EDIT_SUBSCRIPTIONS", subscription);
}

async function patchSubscription(event) {
	const { params, body, user } = event;
	const { id } = params;
	const { markAsWatched, group } = body;
	let { watched } = body;

	let subscription = await Subscription.findOne(
		toObjectId(id) ? { _id: id } : { user: user._id, externalId: id },
	).lean();

	if (watched) {
		if (watched === "all") {
			const episodes = await Episode.find({ seriesId: id });

			watched = episodes.filter(e => e.date && diff(e.date) > 0).map(e => `S${e.season}E${e.number}`);
		}

		try {
			const updateQuery = markAsWatched
				? { $addToSet: { watched: { $each: watched.map(key => ({ key, date: Date.now() })) } } }
				: { $pull: { watched: { key: { $in: watched } } } };

			subscription = await Subscription.findOneAndUpdate(
				toObjectId(id) ? { _id: id } : { user: user._id, externalId: id },
				updateQuery,
				{ new: true },
			).lean();
		} catch (err) {
			return errors.notFound;
		}

		tv.sendSocketUpdate("edit", [subscription], user);
	} else if (group) {
		await Promise.all([
			Subscription.updateMany(
				{
					user: user._id,
					platform: subscription.platform,
					"group.name": { $ne: group.name },
					"group.pos": { $gte: subscription.group.pos, $lte: group.pos },
				},
				{ $inc: { "group.pos": -1 } },
			),
			Subscription.updateMany(
				{
					user: user._id,
					platform: subscription.platform,
					"group.name": { $ne: group.name },
					"group.pos": { $gte: group.pos, $lte: subscription.group.pos },
				},
				{ $inc: { "group.pos": 1 } },
			),
			Subscription.updateMany(
				{ user: user._id, platform: subscription.platform, "group.name": group.name },
				{ "group.pos": group.pos },
				{ new: true },
			),
		]);

		const subscriptions = await getSubscriptions({ user, params: { platform: "tv" } });

		subscription = subscriptions.body.data;
	}

	if (!subscription) return errors.notFound;

	return response(200, "PATCH_SUBSCRIPTIONS", subscription);
}

async function deleteSubscription(event) {
	const { params } = event;
	const { id } = params;

	let subscription = null;
	try {
		subscription = await Subscription.findOneAndUpdate({ _id: id }, { active: false });
	} catch (e) {
		return errors.notFound;
	}

	if (!subscription) return errors.notFound;

	return response(200, "DELETE_SUBSCRIPTIONS", subscription);
}

module.exports = {
	getSubscriptions,
	addSubscriptions,
	editSubscription,
	patchSubscription,
	deleteSubscription,
};
