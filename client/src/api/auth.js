import { api } from "../utils/request";

async function register(user) {
	const res = await api({
		method: "post",
		url: "/api/auth/register",
		data: user,
	});

	if (res.status === 201) window.location.replace("/login");

	return res;
}

async function login(user) {
	const res = await api({
		method: "post",
		url: "/api/auth/login",
		data: user,
	});

	return res;
}

function logout() {
	localStorage.clear();

	window.location.replace("/");
}

async function getApps() {
	const res = await api({
		method: "get",
		url: "/api/auth/apps",
	});

	return res;
}

async function addApp(platform, code) {
	await api({
		method: "post",
		url: "/api/auth/apps",
		data: { platform, code },
		message: true,
	});

	window.location.replace("/settings");
}

async function deleteApp(app) {
	await api({
		method: "delete",
		url: `/api/auth/apps/${app}`,
		message: true,
	});

	window.location.replace("/settings");
}

export {
	register,
	login,
	logout,
	getApps,
	addApp,
	deleteApp,
};
