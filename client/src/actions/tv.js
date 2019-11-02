import { get, post, put, remove } from "../utils/request";

async function getSeries() {
	const res = await get("api/tv");

	return res;
}

async function getSeasons(series) {
	const res = await get(`api/tv/${series}`);

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
	getSearch,
	addSeries,
	editSeries,
	deleteSeries,
};
