import { get, post, put, remove } from "../utils/request";

async function getSeries() {
	const res = await get("api/tv");

	return res;
}

async function getSeasons(series, page) {
	const res = await get(`api/tv/${series}${page >= 0 ? `?page=${page}` : ""}`);

	return res;
}

async function getPopular() {
	const res = await get("api/tv/popular");

	return res;
}

async function getSearch(search) {
	const res = await get(`api/tv/search/${search}`);

	return res;
}

async function addSeries(series) {
	const res = await post("api/tv", series);

	return res;
}

async function editSeries(id, series) {
	const res = await put(`api/tv/${id}`, series);

	return res;
}

async function deleteSeries(id) {
	const res = await remove(`api/tv/${id}`);

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
