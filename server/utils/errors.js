const { error } = require("./request");

module.exports = {
	badRequest: error(400, "BAD_REQUEST"),
	notFound: error(404, "NOT_FOUND"),
	requiredFieldsMissing: error(400, "REQUIRED_FIELDS"),
	duplicated: error(409, "DUPLICATED"),

	userExists: error(409, "USER_DUPLICATED"),
	userPasswordWrong: error(401, "USER_PASSWORD_WRONG"),
	userNotRegistered: error(401, "USER_NOT_REGISTERED"),

	youtubeRefreshToken: error(401, "YOUTUBE_TOKEN"),
	youtubeForbidden: error(403, "YOUTUBE_FORBIDDEN"),

	gmailRefreshToken: error(401, "GMAIL_TOKEN"),
	gmailForbidden: error(403, "GMAIL_FORBIDDEN"),

	redditRefreshToken: error(401, "REDDIT_TOKEN"),
	redditForbidden: error(403, "REDDIT_FORBIDDEN"),
	redditNotFound: subreddit => error(404, `Subreddit ${subreddit} not found`),

	twitchRefreshToken: error(401, "TWITCH_TOKEN"),

	coinmarketcapForbidden: error(403, "COINMARKETCAP_FORBIDDEN"),
	coinmarketcapNotFound: error(404, "COINMARKETCAP_NOT_FOUND"),

	productNotFound: error(404, "PRODUCT_NOT_FOUND"),
};
