const { error } = require("./middleware");

module.exports = {
	notFound: error(404, "Not Found"),
	requiredFieldsMissing: error(400, "Required fields missing"),

	redditRefreshToken: error(400, "Reddit refresh token is invalid"),
	redditForbidden: error(403, "Reddit API is down"),
	redditNotFound: error(404, "Subreddit not found"),

	coinmarketcapForbidden: error(403, "Coinmarketcap API is down"),
	coinmarketcapNotFound: error(404, "Coin not found"),
};
