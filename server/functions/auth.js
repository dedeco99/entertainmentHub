const bcrypt = require("bcryptjs");

const { response } = require("../utils/request");
const errors = require("../utils/errors");

const User = require("../models/user");
const Token = require("../models/token");

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

	if (userExists) return errors.userExists;

	const newUser = new User({ email, password: await hashPassword(password) });
	await newUser.save();

	return response(201, "ADD_USER");
}

async function login(event) {
	const { body } = event;
	const { email, password } = body;

	const user = await User.findOne({ email }).lean();

	if (!user) return errors.userNotRegistered;

	const isPassword = await bcrypt.compare(password, user.password);

	if (!isPassword) return errors.userPasswordWrong;

	const newToken = new Token({ user: user._id, token: generateToken(60) });
	await newToken.save();

	delete user.password;

	return response(200, "LOGIN", { user, token: newToken.token });
}

module.exports = {
	register,
	login,
};
