const { response } = require("../utils/request");
const errors = require("../utils/errors");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

async function hashPassword(password) {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	return hash;
}

async function editUser(event) {
	const { body, user } = event;

	const toUpdate = {};
	if ("email" in body) {
		const email = body.email;

		const userExists = await User.findOne({ email });

		if (userExists && user.email !== email) return errors.userExists;

		toUpdate.email = body.email;
	}
	if ("password" in body) {
		const isPassword = await bcrypt.compare(body.password, user.password);

		if (isPassword) {
			toUpdate.password = await hashPassword(body.newPassword);
		} else {
			return errors.userPasswordWrong;
		}
	}
	if ("language" in body) toUpdate.language = body.language;
	if ("settings" in body) toUpdate.settings = body.settings;

	const updatedUser = await User.findOneAndUpdate({ _id: user._id }, toUpdate, {
		select: "-password",
		new: true,
	}).lean();

	return response(200, "EDIT_USER", updatedUser);
}

module.exports = {
	editUser,
};
