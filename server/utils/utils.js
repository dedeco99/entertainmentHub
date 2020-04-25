const mongoose = require("mongoose");
const moment = require("moment");

function toObjectId(id) {
	return mongoose.Types.ObjectId(id);
}

function formatDate(date, format, relative) {
	return relative ? moment(date).fromNow() : moment(date).format(format);
}

function diff(date, unit) {
	return moment().diff(moment(date), unit);
}

module.exports = {
	toObjectId,
	formatDate,
	diff,
};
