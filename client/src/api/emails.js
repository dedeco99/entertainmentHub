import { api } from "../utils/request";

async function getEmails() {
	const res = await api({
		method: "get",
		url: "/api/emails",
	});

	return res;
}

async function deleteEmail(id) {
	const res = await api({
		method: "delete",
		url: `/api/emails/${id}`,
	});

	return res;
}

export { getEmails, deleteEmail };
