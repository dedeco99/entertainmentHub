import { api } from "../utils/request";

async function getAsset(platform, externalId) {
	const res = await api({
		method: "get",
		url: `/api/assets/${platform}/${externalId}`,
	});

	return res;
}

export { getAsset };
