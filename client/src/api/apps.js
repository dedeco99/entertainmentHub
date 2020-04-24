import { api } from "../utils/request";

async function getApps() {
	const res = await api({
		method: "get",
		url: "/api/apps",
	});

	return res;
}

async function addApp(platform, code) {
	await api({
		method: "post",
		url: "/api/apps",
		data: { platform, code },
		message: true,
	});

	window.location.replace("/settings");
}

async function deleteApp(app) {
	await api({
		method: "delete",
		url: `/api/apps/${app}`,
		message: true,
	});

	window.location.replace("/settings");
}

export {
	getApps,
	addApp,
	deleteApp,
};
