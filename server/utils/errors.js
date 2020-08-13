const { error } = require("./request");

module.exports = {
	notFound: error(404, "Not Found"),
	requiredFieldsMissing: error(400, "Required fields missing"),
	duplicated: error(409, "Duplicated"),

	youtubeRefreshToken: error(401, "Youtube access has been revoked"),
	youtubeForbidden: error(403, "Youtube API limit reached"),

	redditRefreshToken: error(401, "Reddit access has been revoked"),
	redditForbidden: error(403, "Reddit API is down"),
	redditNotFound: subreddit => error(404, `Subreddit ${subreddit} not found`),

	twitchRefreshToken: error(401, "Twitch access has been revoked"),

	coinmarketcapForbidden: error(403, "Coinmarketcap API is down"),
	coinmarketcapNotFound: error(404, "Coin not found"),

	productNotFound: error(404, "Product not found"),
};
