import { get, post, remove } from "../utils/request";

async function register(user) {
	const res = await post("/api/auth/register", user);

	if (res.status === 201) window.location.replace("/login");

	return res;
}

async function login(user) {
	const res = await post("/api/auth/login", user);

	return res;
}

function logout() {
	localStorage.clear();

	window.location.replace("/");
}

async function getApps() {
	const res = await get("/api/auth/apps");

	return res;
}

async function addApp(platform, code) {
	await post("/api/auth/apps", { platform, code });

	window.location.replace("/settings");
}

async function deleteApp(app) {
	await remove(`/api/auth/apps/${app}`);

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
