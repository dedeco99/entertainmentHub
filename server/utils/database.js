const mongoose = require("mongoose");

function initialize() {
	mongoose.set("useFindAndModify", false);
	mongoose.connect(process.env.databaseConnectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	});

	mongoose.connection.once("open", () => console.log("Connected to database"));
}

module.exports = {
	initialize,
};
