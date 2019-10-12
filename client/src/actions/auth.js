import { post } from "axios";

export const register = async (user) => {
	const res = await post("api/auth/register", user);

	return res.data;
};

export const login = async (user) => {
	const res = await post("api/auth/login", user);

	return res.data;
};

export const logout = () => {
	localStorage.removeItem("user");
	localStorage.removeItem("token");

	window.location.replace("/");
};
