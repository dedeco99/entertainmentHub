const mongoose = require("mongoose");

function connect(connectionString) {
	return new Promise(resolve => {
		mongoose.connect(connectionString);

		mongoose.connection.once("open", () => {
			console.log("Connected to database");
			resolve();
		});
	});
}

function disconnect() {
	return new Promise(resolve => {
		mongoose.connection.close();

		mongoose.connection.once("close", () => resolve());
	});
}

module.exports = {
	connect,
	disconnect,
};
