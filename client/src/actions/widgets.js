import { get, post, remove } from "../utils/request";

async function getWidgets() {
	const res = await get("api/widgets");

	return res;
}

async function addWidget(widget) {
	const res = await post("api/widgets", widget);

	return res;
}

async function deleteWidget(id) {
	const res = await remove(`api/widgets/${id}`);

	return res;
}

export {
	getWidgets,
	addWidget,
	deleteWidget,
};
