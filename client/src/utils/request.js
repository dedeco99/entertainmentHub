import axios from "axios";

const get = async (url, headers = {}) => {
	headers.Authorization = `Bearer ${localStorage.getItem("token")}`;

	const config = { headers };

	try {
		const response = await axios.get(url, config);

		return {
			status: response.request.status,
			message: response.data.message,
			data: response.data.data,
		};
	} catch (error) {
		return {
			status: error.request.status,
			message: error.response.data.message,
			data: error.response.data.data,
		};
	}
};

const post = async (url, body, headers = {}) => {
	headers.Authorization = `Bearer ${localStorage.getItem("token")}`;

	const config = { headers };

	try {
		const response = await axios.post(url, body, config);

		return {
			status: response.request.status,
			message: response.data.message,
			data: response.data.data,
		};
	} catch (error) {
		return {
			status: error.request.status,
			message: error.response.data.message,
			data: error.response.data.data,
		};
	}
};

const remove = async (url, headers = {}) => {
	headers.Authorization = `Bearer ${localStorage.getItem("token")}`;

	const config = { headers };

	try {
		const response = await axios.delete(url, config);

		return {
			status: response.request.status,
			message: response.data.message,
			data: response.data.data,
		};
	} catch (error) {
		return {
			status: error.request.status,
			message: error.response.data.message,
			data: error.response.data.data,
		};
	}
};

export {
	get,
	post,
	remove,
};
