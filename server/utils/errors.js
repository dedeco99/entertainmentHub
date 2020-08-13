const { error } = require("./request");

module.exports = {
	notFound: error(404, "NOT_FOUND"),
	requiredFieldsMissing: error(400, "REQUIRED_FIELDS"),
	duplicated: error(409, "DUPLICATED"),

	youtubeRefreshToken: error(401, "YOUTUBE_TOKEN"),
	youtubeForbidden: error(403, "YOUTUBE_FORBIDDEN"),

	redditRefreshToken: error(401, "REDDIT_TOKEN"),
	redditForbidden: error(403, "REDDIT_FORBIDDEN"),
	redditNotFound: subreddit => error(404, `Subreddit ${subreddit} not found`),

	twitchRefreshToken: error(401, "TWITCH_TOKEN"),

	coinmarketcapForbidden: error(403, "COINMARKETPLACE_FORBIDDEN"),
	coinmarketcapNotFound: error(404, "COINMARKETPLACE_NOT_FOUND"),

	productNotFound: error(404, "PRODUCT_NOT_FOUND"),
};
