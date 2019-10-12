import axios from "axios";

const get = async (url, headers = {}) => {
	headers.Authorization = "Bearer " + localStorage.getItem("token");

	const config = { headers };

	const response = await axios.get(url, config);

	return response.data;
};

const post = async (url, body, headers = {}) => {
	headers.Authorization = "Bearer " + localStorage.getItem("token");

	const config = { headers };

	const response = await axios.post(url, body, config);

	return response.data;
};

export {
	get,
	post,
};
