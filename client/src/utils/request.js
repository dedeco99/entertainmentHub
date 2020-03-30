import axios from "axios";

async function get(url, headers = {}) {
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
}

async function post(url, body, headers = {}) {
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
}

async function put(url, body, headers = {}) {
	headers.Authorization = `Bearer ${localStorage.getItem("token")}`;

	const config = { headers };

	try {
		const response = await axios.put(url, body, config);

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
}

async function remove(url, headers = {}) {
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
}

export {
	get,
	post,
	put,
	remove,
};
