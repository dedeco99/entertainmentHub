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

	const token = await Token.findOne({ token: bearerToken[1] });

	if (!token) return false;

	const user = await User.findOne({ _id: token.user });

	return user;
}

async function middleware(req, res, fn, options) {
	const event = {};

	for (const option in options) {
		switch (option) {
			case "token":
				const validToken = await token(req.headers.authorization);

				if (!validToken) res.status(401).json({ type: "error", text: "Invalid Token" });
				event.user = validToken;

				break;
			default:
				break;
		}
	}

	event.headers = req.headers;
	event.params = req.params;
	event.query = req.query;
	event.body = req.body;

	const response = await fn(event);

	return res.status(response.status).send(response.body);
}

module.exports = {
	response,
	middleware,
};
