const mongoose = require("mongoose");

const secrets = require("./secrets");

mongoose.set("useFindAndModify", false);
mongoose.connect(secrets.databaseConnectionString, { useNewUrlParser: true });

const Auth = require("./models/auth");

/* Channel */

const getAuth = async (query) => {
	console.log(query);
	return await Auth.findOne(query);
};

module.exports = {
	getAuth
};
