import { api } from "../utils/request";

async function register(user) {
	const res = await api({
		method: "post",
		url: "/api/auth/register",
		data: user,
	});

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

export {
	register,
	login,
	logout,
};
