import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext";

import { addApp } from "../../api/apps";

function Apps() {
	const history = useHistory();
	const { dispatch } = useContext(UserContext);

	useEffect(() => {
		async function fetchData() {
			const platform = history.location.pathname.split("/")[2];
			let code = history.location.search.split("code=")[1];
			code = platform === "youtube" || platform === "twitch" ? code.split("&")[0] : code;

			const response = await addApp(platform, code);

			if (response.status === 201) {
				dispatch({ type: "ADD_APP", app: response.data });

				history.push("/settings/apps");
			}
		}

		fetchData();
	}, []); // eslint-disable-line

	return <center>{"App has been added"}</center>;
}

export default Apps;
