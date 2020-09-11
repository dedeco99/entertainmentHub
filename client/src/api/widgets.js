import { api } from "../utils/request";

async function getWidgets() {
	const res = await api({
		method: "get",
		url: "/api/widgets",
	});

	return res;
}

async function addWidget(widget) {
	const res = await api({
		method: "post",
		url: "/api/widgets",
		data: widget,
		message: true,
	});

	return res;
}

async function editWidget(widget) {
	const res = await api({
		method: "put",
		url: `/api/widgets/${widget._id}`,
		data: widget,
	});

	return res;
}

async function editWidgets(widgets) {
	const res = await api({
		method: "put",
		url: "/api/widgets",
		data: widgets,
	});

	return res;
}

async function deleteWidget(id) {
	const res = await api({
		method: "delete",
		url: `/api/widgets/${id}`,
		message: true,
	});

	return res;
}

export { getWidgets, addWidget, editWidget, editWidgets, deleteWidget };
