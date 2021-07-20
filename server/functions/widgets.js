const { response } = require("../utils/request");
const errors = require("../utils/errors");

const { isSubreddit } = require("./reddit");
const { getProduct } = require("./price");

const Widget = require("../models/widget");

async function getWidgets(event) {
	const { user } = event;

	const widgets = await Widget.find({ user: user._id }).lean();

	return response(200, "GET_WIDGETS", widgets);
}

// eslint-disable-next-line complexity
async function addWidget(event) {
	const { body, user } = event;
	const { type, group, width, height, refreshRateMinutes, info } = body;

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
		case "tv":
			if (!info.tabs) return errors.requiredFieldsMissing;
			break;
		case "weather":
			if (!info.lat || !info.lon) return errors.requiredFieldsMissing;
			break;
		case "finance":
			if (!info.coins) return errors.requiredFieldsMissing;
			break;
		case "price":
			if (!info.country || !info.productId) return errors.requiredFieldsMissing;

			const res = await getProduct({ params: { country: info.country, product: info.productId } });

			if (res.status === 404) return errors.productNotFound;

			break;
		default:
			break;
	}

	const widget = new Widget({
		user: user._id,
		type,
		group,
		width,
		height,
		refreshRateMinutes,
		info,
	});

	await widget.save();

	return response(201, "ADD_WIDGET", widget);
}

async function editWidget(event) {
	const { params, body } = event;
	const { id } = params;
	const { group, info, x, y, width, height, refreshRateMinutes } = body;

	const widgetExists = await Widget.findOne({ _id: id }).lean();

	if (!widgetExists) return response(404, "Widget doesn't exist");

	const widget = await Widget.findOneAndUpdate(
		{ _id: id },
		{ group, info, x, y, width, height, refreshRateMinutes },
		{ new: true },
	).lean();

	return response(200, "EDIT_WIDGET", widget);
}

async function editWidgets(event) {
	const { body } = event;
	const widgets = body;

	const promises = [];
	for (const widget of widgets) {
		const { _id, group, info, x, y, width, height } = widget;

		promises.push(Widget.findOneAndUpdate({ _id }, { group, info, x, y, width, height }, { new: true }).lean());
	}

	const updatedWidgets = await Promise.all(promises);

	return response(200, "EDIT_WIDGETS", updatedWidgets);
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

	return response(200, "DELETE_WIDGET", widget);
}

module.exports = {
	getWidgets,
	addWidget,
	editWidget,
	editWidgets,
	deleteWidget,
};
