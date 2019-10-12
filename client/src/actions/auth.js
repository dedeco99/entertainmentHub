import { post } from "../utils/request";

const register = async (user) => {
	const res = await post("/api/auth/register", user);

	return res.data;
};

const login = async (user) => {
	const res = await post("/api/auth/login", user);

	return res.data;
};

const logout = () => {
	localStorage.removeItem("user");
	localStorage.removeItem("token");

	window.location.replace("/");
};

const addApp = async (platform, code) => {
	window.location.replace("/");

	await post("/api/auth/apps", { platform, code });
}

export {
	register,
	login,
	logout,
	addApp,
}