const bcrypt = require("bcryptjs");

const { post } = require("./request");
const { middleware, response } = require("./utils");
const { getUser, createUser, createToken, getApp, createApp } = require("./database");

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	return hash;
};

const generateToken = (length) => {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let token = "";

	for (let i = 0, j = charset.length; i < length; ++i) {
		token += charset.charAt(Math.floor(Math.random() * j));
	}

	return token;
};

const register = async (event) => {
	const { body } = event;
	const { email, password } = body;

	const userExists = await getUser({ email });

	if (userExists) return response(409, "User already exists");

	await createUser({ email, password: await hashPassword(password) });

	return response(201, "User registered successfully");
};

const login = async (event) => {
	const { body } = event;
	const { email, password } = body;

	const user = await getUser({ email });

	if (user) {
		const isPassword = await bcrypt.compare(password, user.password);

		if (isPassword) {
			const newToken = await createToken({ user: user._id, token: generateToken(60) });

			return response(200, "Login successful", { user: user.id, token: newToken.token });
		}

		return response(401, "Password is incorrect");
	}

	return response(401, "User is not registered");
};

const addApp = async (event) => {
	const { body, user } = event;
	const { platform, code } = body;
	const appExists = await getApp({ user: user._id, platform });

	if (appExists) return response(409, "App already exists");
	console.log(code);

	let json = {};
	let url = null;
	let res = null;
	switch (platform) {
		case "reddit":
			url = `https://www.reddit.com/api/v1/access_token?code=${code}&grant_type=authorization_code&redirect_uri=${process.env.redirect}/apps/reddit`;

			const encryptedAuth = new Buffer.from(`${process.env.redditClientId}:${process.env.redditSecret}`).toString("base64"); /* eslint-disable-line no-undef */
			const auth = `Basic ${encryptedAuth}`;

			const headers = {
				"User-Agent": "Entertainment-Hub by dedeco99",
				"Authorization": auth,
			};

			res = await post(url, headers);
			json = JSON.parse(res);
			break;
		case "twitch":
			url = `https://api.twitch.tv/kraken/oauth2/token?client_id=${process.env.twitchClientId}&client_secret=${process.env.twitchSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.redirect}/apps/twitch`;

			res = await post(url);
			json = JSON.parse(res);
			break;
		case "youtube":
			url = `https://www.googleapis.com/oauth2/v4/token?client_id=${process.env.googleClientId}&client_secret=${process.env.googleSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.redirect}/apps/google`;

			res = await post(url, headers);
			json = JSON.parse(res);
			break;
		default:
			break;
	}
	console.log(json);
	if (json.refresh_token) {
		await createApp({ user: user._id, platform, refreshToken: json.refresh_token });
		return response(201, "App added");
	}

	return response(400, "Bad Request");
};

module.exports = {
	register: (req, res) => middleware(req, res, register),
	login: (req, res) => middleware(req, res, login),
	addApp: (req, res) => middleware(req, res, addApp, { token: true }),
};
