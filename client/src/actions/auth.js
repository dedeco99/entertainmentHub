import { get, post, remove } from "../utils/request";

const register = async (user) => {
	const res = await post("/api/auth/register", user);

	if (res.status === 201) window.location.replace("/login");

	return { type: "error", text: res.message };
};

const login = async (user) => {
	const res = await post("/api/auth/login", user);

	if (res.status === 200) {
		localStorage.setItem("user", res.data.user);
		localStorage.setItem("token", res.data.token);

		window.location.replace("/");
	}

	return { type: "error", text: res.message };
};

const logout = () => {
	localStorage.clear();

	window.location.replace("/");
};

const getApps = async () => {
	const res = await get("/api/auth/apps");

	return res;
};

const addApp = async (platform, code) => {
	await post("/api/auth/apps", { platform, code });

	window.location.replace("/settings");
};

const deleteApp = async (app) => {
	await remove(`/api/auth/apps/${app}`);
};

export {
	register,
	login,
	logout,
	getApps,
	addApp,
	deleteApp,
};
