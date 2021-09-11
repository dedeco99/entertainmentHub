import { api } from "../utils/request";

async function getApps() {
	const res = await api({
		method: "get",
		url: "/api/apps",
	});

	return res;
}

async function addApp(platform, code) {
	const res = await api({
		method: "post",
		url: "/api/apps",
		data: { platform, code },
		message: true,
	});

	return res;
}

async function patchApp(id, data) {
	const res = await api({
		method: "patch",
		url: `/api/apps/${id}`,
		data,
	});

	return res;
}

async function deleteApp(app) {
	const res = await api({
		method: "delete",
		url: `/api/apps/${app}`,
		message: true,
	});

	return res;
}

export { getApps, addApp, patchApp, deleteApp };
