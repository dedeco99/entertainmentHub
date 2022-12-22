import { api } from "../utils/request";

async function getEpisodes(series, season, page, filter) {
	let query = "";
	query += page >= 0 ? `?page=${page}` : "";
	query += filter ? `${query ? "&" : "?"}filter=${filter}` : "";

	const res = await api({
		method: "get",
		url: `/api/tv/${series}${season ? `/${season}` : ""}${query}`,
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

async function getRecommendations(page, contentType) {
	let query = "";
	query += page >= 0 ? `?page=${page}` : "";
	query += contentType ? `${query ? "&" : "?"}contentType=${contentType}` : "";

	const res = await api({
		method: "get",
		url: `/api/tv/recommendations${query}`,
	});

	return res;
}

async function getProviders(type, search) {
	const res = await api({
		method: "get",
		url: `/api/tv/providers?type=${type}&search=${search}`,
	});

	return res;
}

export { getEpisodes, getSearch, getPopular, getRecommendations, getProviders };
