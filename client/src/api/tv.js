import { api } from "../utils/request";

async function getSeries() {
	const res = await api({
		method: "get",
		url: "/api/tv",
	});

	return res;
}

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

async function getPopular(page) {
	const res = await api({
		method: "get",
		url: `/api/tv/popular${page >= 0 ? `?page=${page}` : ""}`,
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

async function addSeries(series) {
	const res = await api({
		method: "post",
		url: "/api/tv",
		data: series,
		message: true,
	});

	return res;
}

async function editSeries(id, series) {
	const res = await api({
		method: "put",
		url: `/api/tv/${id}`,
		data: series,
		message: true,
	});

	return res;
}

async function deleteSeries(id) {
	const res = await api({
		method: "delete",
		url: `/api/tv/${id}`,
		message: true,
	});

	return res;
}

export {
	getSeries,
	getSeasons,
	getPopular,
	getSearch,
	addSeries,
	editSeries,
	deleteSeries,
};
