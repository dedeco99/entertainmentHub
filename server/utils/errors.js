const { error } = require("./middleware");

module.exports = {
	notFound: error(404, "Not Found"),
	requiredFieldsMissing: error(400, "Required fields missing"),
	duplicated: error(409, "Duplicated"),

	youtubeRefreshToken: error(400, "Youtube refresh token is invalid"),
	youtubeForbidden: error(403, "Youtube API limit reached"),

	redditRefreshToken: error(400, "Reddit refresh token is invalid"),
	redditForbidden: error(403, "Reddit API is down"),
	redditNotFound: subreddit => error(404, `Subreddit ${subreddit} not found`),

	coinmarketcapForbidden: error(403, "Coinmarketcap API is down"),
	coinmarketcapNotFound: error(404, "Coin not found"),
};
