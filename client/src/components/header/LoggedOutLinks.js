import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@material-ui/core";

import { translate } from "../../utils/translations";

function LoggedOutLinks() {
	return (
		<div>
			<Link to="/register" style={{ marginRight: 20 }}>
				<Button color="primary" variant="outlined">
					{translate("register")}
				</Button>
			</Link>
			<Link to="/login">
				<Button color="primary" variant="outlined">
					{translate("login")}
				</Button>
			</Link>
		</div>
	);
}

export default LoggedOutLinks;
