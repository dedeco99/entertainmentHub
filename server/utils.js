const mongoose = require("mongoose");

function toObjectId(id) {
	return mongoose.Types.ObjectId(id);
}

module.exports = {
	toObjectId,
};
