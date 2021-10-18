import { api } from "../utils/request";

async function editUser(user) {
	const res = await api({
		method: "put",
		url: "/api/users",
		data: user,
		message: true,
	});

	return res;
}

export { editUser };
