import { api } from "../utils/request";

async function getEmails() {
	const res = await api({
		method: "get",
		url: "/api/gmail",
	});

	return res;
}

export { getEmails };
