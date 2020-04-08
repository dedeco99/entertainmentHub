const { middleware, response } = require("./utils");
const errors = require("./errors");

const Widget = require("./models/widget");

async function getWidgets(event) {
	const { user } = event;

	const widgets = await Notification.find({ user: user._id }).lean();

	return response(200, "Widgets found", widgets);
}

async function deleteWidget(event) {
	const { params } = event;
	const { id } = params;

	let widget = null;
	try {
		widget = await Widget.findOneAndDelete({ _id: id });
	} catch (e) {
		throw errors.notFound;
	}

	if (!widget) throw errors.notFound;

	return response(200, "Widget deleted", widget);
}

module.exports = {
	getWidgets: (req, res) => middleware(req, res, getWidgets, ["token"]),
	deleteWidget: (req, res) => middleware(req, res, deleteWidget, ["token"]),
};
