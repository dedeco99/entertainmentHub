const { response } = require("./utils");

module.exports = {
	notFound: response(404, "Not Found"),
	redditRefreshToken: response(400, "Reddit refresh token is invalid"),
	redditForbidden: response(403, "Reddit API is down"),
	redditNotFound: response(404, "Subreddit not found"),
};
