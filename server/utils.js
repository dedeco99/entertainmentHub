const User = require("./models/user");
const Token = require("./models/token");

function response(status, message, data) {
	return {
		status,
		body: {
			message,
			data,
		},
	};
}

async function token(authorization) {
	if (!authorization) return false;

	const bearerToken = authorization.split(" ");

	if (bearerToken[0] !== "Bearer") return false;

	if (!bearerToken[1]) return false;

	const tokenFound = await Token.findOne({ token: bearerToken[1] });

	if (!tokenFound) return false;

	const user = await User.findOne({ _id: tokenFound.user });

	return user;
}

async function middleware(req, res, fn, options) {
	const event = {};

	if (options && options.includes("token")) {
		const validToken = await token(req.headers.authorization);

		if (!validToken) res.status(401).json({ type: "error", text: "Invalid Token" });
		event.user = validToken;
	}

	event.headers = req.headers;
	event.params = req.params;
	event.query = req.query;
	event.body = req.body;

	const result = await fn(event);

	return res.status(result.status).send(result.body);
}

module.exports = {
	response,
	middleware,
};
