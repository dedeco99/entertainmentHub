const { Types } = require("mongoose");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

function toObjectId(id) {
	return Types.ObjectId(id);
}

function formatDate(date, format, relative, originalFormat) {
	return relative ? dayjs(date).fromNow() : dayjs(date, originalFormat).format(format);
}

function diff(date, unit) {
	return dayjs().diff(dayjs(date), unit);
}

module.exports = {
	toObjectId,
	formatDate,
	diff,
};
