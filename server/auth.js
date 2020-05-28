const bcrypt = require("bcryptjs");

const { middleware, response } = require("./utils/middleware");

const User = require("./models/user");
const Token = require("./models/token");


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

	const user = await User.findOne({ email }).lean();

	if (user) {
		const isPassword = await bcrypt.compare(password, user.password);

		if (isPassword) {
			const newToken = new Token({ user: user._id, token: generateToken(60) });
			await newToken.save();

			delete user.password;

			return response(200, "Login successful", { user, token: newToken.token });
		}

		return response(401, "Password is incorrect");
	}

	return response(401, "User is not registered");
}

module.exports = {
	register,
	login,
};
