import axios from "axios";
import { toast } from "react-toastify";

import { translate } from "./translations";

async function api({ method, url, data, headers = {}, message = false }) {
	const user = JSON.parse(localStorage.getItem("user"));

	if (user && user.token) headers.Authorization = `Bearer ${user.token}`;

	try {
		const res = await axios.request({ method, url, data, headers, timeout: 30000 });

		if (message) toast.success(translate(res.data.message));

		return {
			status: res.request.status,
			message: res.data.message,
			data: res.data.data,
		};
	} catch (error) {
		if (error.response) {
			toast.error(translate(error.response.data.message));

			return {
				status: error.request.status,
				message: error.response.data.message,
				data: error.response.data.data,
			};
		}

		return toast.error("No internet");
	}
}

export { api };
