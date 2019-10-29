const mongoose = require("mongoose");

function initialize() {
	mongoose.set("useFindAndModify", false);
	mongoose.connect(process.env.databaseConnectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	});
}

module.exports = {
	initialize,
};
