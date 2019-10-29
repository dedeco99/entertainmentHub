import { get, post, remove } from "../utils/request";

async function register(user) {
	const res = await post("/api/auth/register", user);

	if (res.status === 201) window.location.replace("/login");

	return { type: "error", text: res.message };
}

async function login(user) {
	const res = await post("/api/auth/login", user);

	if (res.status === 200) {
		localStorage.setItem("user", res.data.user);
		localStorage.setItem("token", res.data.token);

		window.location.replace("/");
	}

	return { type: "error", text: res.message };
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
}

export {
	register,
	login,
	logout,
	getApps,
	addApp,
	deleteApp,
};
