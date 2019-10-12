import { get, post } from "../utils/request";

const getSeries = async () => {
	const res = await get('api/tv');

	return res;
};

const getSeasons = async (series) => {
	const res = await get(`api/tv/${series}`);

	return res;
};

const getEpisodes = async (series, season) => {
	const res = await get(`api/tv/${series}/${season}`);

	return res;
};

const getSearch = async (search) => {
	const res = await get(`api/tv/search/${search}`);

	return res;
};

const addSeries = async (series) => {
	const res = await post('api/tv', series);

	return res;
};

export {
	getSeries,
	getSeasons,
	getEpisodes,
	getSearch,
	addSeries,
};