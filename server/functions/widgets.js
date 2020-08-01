const { response } = require("../utils/request");
const errors = require("../utils/errors");

const { isSubreddit } = require("./reddit");

const Widget = require("../models/widget");

async function getWidgets(event) {
	const { user } = event;

	const widgets = await Widget.find({ user: user._id }).lean();

	return response(200, "Widgets found", widgets);
}

async function addWidget(event) {
	const { body, user } = event;
	const { type, info } = body;

	if (!type) return errors.requiredFieldsMissing;

	switch (type) {
		case "reddit":
			if (!info.subreddit) return errors.requiredFieldsMissing;

			const subreddits = info.subreddit.split("+");
			for (const subreddit of subreddits) {
				const subredditExists = await isSubreddit(subreddit, user);

				if (!subredditExists) return errors.redditNotFound(subreddit);
			}

			break;
		case "weather":
			if (!info.lat || !info.lon) return errors.requiredFieldsMissing;
			break;
		case "crypto":
			if (!info.coins) return errors.requiredFieldsMissing;
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

	return response(201, "Widget created", widget);
}

async function editWidget(event) {
	const { params, body } = event;
	const { id } = params;
	const { info, x, y, width, height } = body;

	const widgetExists = await Widget.findOne({ _id: id }).lean();

	if (!widgetExists) return response(404, "Widget doesn't exist");

	const widget = await Widget.findOneAndUpdate({ _id: id }, { info, x, y, width, height }, { new: true }).lean();

	return response(200, "Widget has been updated", widget);
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
	getWidgets,
	addWidget,
	editWidget,
	deleteWidget,
};
