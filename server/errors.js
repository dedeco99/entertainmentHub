module.exports = {
	notFound: {
		status: 404,
		message: "Not Found",
	},
	redditRefreshToken: {
		status: 400,
		message: "Reddit refresh token is invalid",
	},
	redditForbidden: {
		status: 403,
		message: "Reddit API is down",
	},
	redditNotFound: {
		status: 404,
		message: "Subreddit not found",
	},
};
