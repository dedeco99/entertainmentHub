const fs = require("fs");

function error(err) {
	fs.appendFile("logs.txt", `${err}\n`, () => console.log("Error has been logged"));
}

module.exports = {
	error,
};
