import { post } from "../utils/request";

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
	localStorage.removeItem("user");
	localStorage.removeItem("token");

	window.location.replace("/");
};

const addApp = async (platform, code) => {
	window.location.replace("/");

	await post("/api/auth/apps", { platform, code });
};

export {
	register,
	login,
	logout,
	addApp,
};
