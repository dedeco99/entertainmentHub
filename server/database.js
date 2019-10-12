const mongoose = require("mongoose");

const User = require("./models/user");
const Token = require("./models/token");
const Auth = require("./models/auth");
const Series = require("./models/series");

const initialize = () => {
	mongoose.set("useFindAndModify", false);
	mongoose.connect(process.env.databaseConnectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	});
};

/* User */

const getUser = async (query) => {
	return await User.findOne(query);
};

const createUser = async (user) => {
	const newUser = new User(user);

	await newUser.save();

	return newUser;
};

/* Token */

const getToken = async (query) => {
	return await Token.findOne(query);
};

const createToken = async (token) => {
	const newToken = new Token(token);

	await newToken.save();

	return newToken;
};

/* Auth */

const getAuth = async (query) => {
	return await Auth.findOne(query);
};

module.exports = {
	initialize,
	getUser,
	createUser,
	getToken,
	createToken,
	getAuth,
};
