const { response } = require("../utils/request");
const { hashPassword, isPassword } = require("../utils/utils");
const errors = require("../utils/errors");

const User = require("../models/user");

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
		const correctPassword = await isPassword(body.password, user.password);

		if (correctPassword) {
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
