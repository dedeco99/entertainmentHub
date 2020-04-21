const { middleware, response } = require("./middleware");

const User = require("./models/user");

async function editSettings(event) {
	const { body, user } = event;

	const updatedUser = await User.findOneAndUpdate(
		{ _id: user._id },
		{ settings: body },
		{ new: true },
	).lean();

	return response(200, "Settings have been updated", updatedUser.settings);
}

module.exports = {
	editSettings: (req, res) => middleware(req, res, editSettings, ["token"]),
};
