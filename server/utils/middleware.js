const User = require("../models/user");
const Token = require("../models/token");

function response(status, message, data) {
	return {
		status,
		body: {
			message,
			data,
		},
	};
}

function error(status, message, data) {
	return {
		status,
		body: {
			message,
			data,
		},
	};
}

async function token(req, res, next) {
	const authorization = req.headers.authorization;

	if (!authorization) return error(401, "Invalid Token");

	const bearerToken = authorization.split(" ");

	if (bearerToken[0] !== "Bearer" || !bearerToken[1]) return error(401, "Invalid Token");

	const tokenFound = await Token.findOne({ token: bearerToken[1] });

	if (!tokenFound) return error(401, "Invalid Token");

	const user = await User.findOne({ _id: tokenFound.user });

	req.user = user;

	next();
}

async function middleware(req, res, fn) {
	const event = {
		headers: req.headers,
		params: req.params,
		query: req.query,
		body: req.body,
		user: req.user,
	}

	const result = await fn(event);

	return res.status(result.status).send(result.body);
}

module.exports = {
	response,
	error,
	token,
	middleware,
};
