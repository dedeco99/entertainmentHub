const { error } = require("./utils");

module.exports = {
	notFound: error(404, "Not Found"),
	requiredFieldsMissing: error(400, "Required fields missing"),

	redditRefreshToken: error(400, "Reddit refresh token is invalid"),
	redditForbidden: error(403, "Reddit API is down"),
	redditNotFound: error(404, "Subreddit not found"),
};
