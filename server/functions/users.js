const { response } = require("../utils/request");

const User = require("../models/user");

async function editUser(event) {
	const { body, user } = event;

	const toUpdate = {};
	if ("email" in body) toUpdate.email = body.email;
	if ("language" in body) toUpdate.language = body.language;
	if ("settings" in body) toUpdate.settings = body.settings;

	const updatedUser = await User.findOneAndUpdate({ _id: user._id }, toUpdate, {
		select: "-password",
		new: true,
	}).lean();

	return response(200, "User has been edited", updatedUser);
}

module.exports = {
	editUser,
};
