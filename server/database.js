const mongoose = require("mongoose");

const secrets = require("./secrets");
const User = require("./models/user");
const Auth = require("./models/auth");

const initialize = () => {
	mongoose.set("useFindAndModify", false);
	mongoose.connect(secrets.databaseConnectionString, { useNewUrlParser: true });
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

/* Auth */

const getAuth = async (query) => {
	return await Auth.findOne(query);
};

module.exports = {
	initialize,
	getUser,
	createUser,
	getAuth
};
