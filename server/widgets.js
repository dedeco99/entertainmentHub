const { middleware, response } = require("./utils");
const errors = require("./errors");

const Widget = require("./models/widget");

async function getWidgets(event) {
	const { user } = event;

	const widgets = await Widget.find({ user: user._id }).lean();

	return response(200, "Widgets found", widgets);
}

async function addWidget(event) {
	const { body, user } = event;
	const { type, info } = body;

	switch (type) {
		case "reddit":
			if (!info.subreddit) return errors.requiredFieldsMissing;
			break;
		default:
			break;
	}

	const widget = new Widget({
		user: user._id,
		type,
		info,
	});

	await widget.save();

	return response(200, "Widget created", widget);
}

async function deleteWidget(event) {
	const { params } = event;
	const { id } = params;

	let widget = null;
	try {
		widget = await Widget.findOneAndDelete({ _id: id });
	} catch (e) {
		return errors.notFound;
	}

	if (!widget) return errors.notFound;

	return response(200, "Widget deleted", widget);
}

module.exports = {
	getWidgets: (req, res) => middleware(req, res, getWidgets, ["token"]),
	addWidget: (req, res) => middleware(req, res, addWidget, ["token"]),
	deleteWidget: (req, res) => middleware(req, res, deleteWidget, ["token"]),
};
