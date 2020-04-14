const bcrypt = require("bcryptjs");

const { api } = require("./request");
const { middleware, response } = require("./middleware");

const User = require("./models/user");
const Token = require("./models/token");

const App = require("./models/app");

async function hashPassword(password) {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	return hash;
}

function generateToken(length) {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let token = "";

	for (let i = 0, j = charset.length; i < length; ++i) {
		token += charset.charAt(Math.floor(Math.random() * j));
	}

	return token;
}

async function register(event) {
	const { body } = event;
	const { email, password } = body;

	const userExists = await User.findOne({ email });

	if (userExists) return response(409, "User already exists");

	const newUser = new User({ email, password: await hashPassword(password) });
	await newUser.save();

	return response(201, "User registered successfully");
}

async function login(event) {
	const { body } = event;
	const { email, password } = body;

	const user = await User.findOne({ email });

	if (user) {
		const isPassword = await bcrypt.compare(password, user.password);

		if (isPassword) {
			const newToken = new Token({ user: user._id, token: generateToken(60) });
			await newToken.save();

			return response(200, "Login successful", { user: user.id, token: newToken.token });
		}

		return response(401, "Password is incorrect");
	}

	return response(401, "User is not registered");
}

async function getApps(event) {
	const { user } = event;

	const apps = await App.find({ user: user._id });

	return response(200, "Apps found", apps);
}

async function addApp(event) {
	const { body, user } = event;
	const { platform, code } = body;
	const appExists = await App.findOne({ user: user._id, platform });

	if (appExists) return response(409, "App already exists");

	let json = {};
	switch (platform) {
		case "reddit": {
			const url = `https://www.reddit.com/api/v1/access_token?code=${code}&grant_type=authorization_code&redirect_uri=${process.env.redirect}/apps/reddit`;

			const encryptedAuth = new Buffer.from(`${process.env.redditClientId}:${process.env.redditSecret}`).toString("base64");
			const auth = `Basic ${encryptedAuth}`;

			const headers = {
				"User-Agent": "Entertainment-Hub by dedeco99",
				"Authorization": auth,
			};

			const res = await api({ method: "post", url, headers });
			json = res.data;
			break;
		}
		case "twitch": {
			const url = `https://api.twitch.tv/kraken/oauth2/token?client_id=${process.env.twitchClientId}&client_secret=${process.env.twitchSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.redirect}/apps/twitch`;

			const res = await api({ method: "post", url });
			json = res.data;
			break;
		}
		case "youtube": {
			const url = `https://www.googleapis.com/oauth2/v4/token?client_id=${process.env.googleClientId}&client_secret=${process.env.googleSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.redirect}/apps/google`;

			const res = await api({ method: "post", url });
			json = res.data;
			break;
		}
		default: {
			break;
		}
	}

	if (json.refresh_token) {
		const newApp = new App({ user: user._id, platform, refreshToken: json.refresh_token });
		await newApp.save();

		return response(201, "App added");
	} else if (platform === "tv") {
		const newApp = new App({ user: user._id, platform });
		await newApp.save();

		return response(201, "App added");
	}

	return response(400, "Bad Request");
}

async function deleteApp(event) {
	const { params } = event;
	const { app } = params;

	try {
		await App.deleteOne({ _id: app });

		return response(200, "App deleted");
	} catch (err) {
		return response(400, err);
	}
}

module.exports = {
	register: (req, res) => middleware(req, res, register),
	login: (req, res) => middleware(req, res, login),
	getApps: (req, res) => middleware(req, res, getApps, ["token"]),
	addApp: (req, res) => middleware(req, res, addApp, ["token"]),
	deleteApp: (req, res) => middleware(req, res, deleteApp, ["token"]),
};
