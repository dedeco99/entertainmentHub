const bcrypt = require("bcryptjs");
const { Types } = require("mongoose");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

async function hashPassword(password) {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	return hash;
}

function isPassword(password, userPassword) {
	return bcrypt.compare(password, userPassword);
}

function toObjectId(id) {
	try {
		return Types.ObjectId(id);
	} catch (err) {
		return false;
	}
}

function formatDate(date, format, relative, originalFormat) {
	return relative ? dayjs(date).fromNow() : dayjs(date, originalFormat).format(format);
}

function diff(date, unit) {
	return dayjs().diff(dayjs(date), unit);
}

module.exports = {
	hashPassword,
	isPassword,
	toObjectId,
	formatDate,
	diff,
};
