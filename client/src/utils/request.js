import axios from "axios";
import { toast } from "react-toastify";

async function api({ method, url, data, headers = {}, message = false }) {
	const user = JSON.parse(localStorage.getItem("user"));

	if (user.token) headers.Authorization = `Bearer ${user.token}`;

	try {
		const res = await axios.request({ method, url, data, headers });

		if (message) toast.success(res.data.message);

		return {
			status: res.request.status,
			message: res.data.message,
			data: res.data.data,
		};
	} catch (error) {
		toast.error(error.response.data.message);

		return {
			status: error.request.status,
			message: error.response.data.message,
			data: error.response.data.data,
		};
	}
}

export {
	api,
};
