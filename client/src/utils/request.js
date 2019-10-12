import axios from "axios";

const get = async (url, headers = {}) => {
	headers.Authorization = "Bearer " + localStorage.getItem("token");

	const config = { headers };

	const response = await axios.get(url, config);

	return response.data;
};

const post = (url, headers = {}, body) => {
	headers.Authorization = "Bearer " + localStorage.getItem("token");

	const config = { headers };

	const response = axios.post(url, body, config);

	return response.data;
};

export {
	get,
	post
};
