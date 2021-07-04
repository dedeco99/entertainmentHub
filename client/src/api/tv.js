import { api } from "../utils/request";

async function getSeasons(series, page, filter) {
	let query = "";
	query += page >= 0 ? `?page=${page}` : "";
	query += filter ? `${query ? "&" : "?"}filter=${filter}` : "";

	const res = await api({
		method: "get",
		url: `/api/tv/${series}${query}`,
	});

	return res;
}

async function getPopular(page, source, type) {
	let query = "";
	query += page >= 0 ? `?page=${page}` : "";
	query += source ? `${query ? "&" : "?"}source=${source}` : "";
	query += type ? `${query ? "&" : "?"}type=${type}` : "";

	const res = await api({
		method: "get",
		url: `/api/tv/popular${query}`,
	});

	return res;
}

async function getSearch(search, page) {
	const res = await api({
		method: "get",
		url: `/api/tv/search/${search}${page >= 0 ? `?page=${page}` : ""}`,
	});

	return res;
}

export { getSeasons, getPopular, getSearch };
