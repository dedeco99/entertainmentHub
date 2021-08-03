import { api } from "../utils/request";

async function getEmails() {
	const res = await api({
		method: "get",
		url: "/api/emails",
	});

	return res;
}

async function getEmailLabels() {
	const res = await api({
		method: "get",
		url: "/api/emails/labels",
	});

	return res;
}

async function editEmail(id, label) {
	const res = await api({
		method: "put",
		url: `/api/emails/${id}`,
		data: { label },
		message: true,
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

export { getEmails, getEmailLabels, editEmail, deleteEmail };
