import { api } from "../utils/request";

async function editSettings(settings) {
	const res = await api({
		method: "put",
		url: "api/settings",
		data: settings,
	});

	return res;
}

export {
	editSettings,
};
