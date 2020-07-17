import React from "react";
import { NavLink } from "react-router-dom";
import Button from "@material-ui/core/Button";

function LoggedOutLinks() {
	return (
		<div>
			<NavLink to="/register" style={{ marginRight: 20 }}>
				<Button color="primary" variant="outlined">{"Register"}</Button>
			</NavLink>
			<NavLink to="/login">
				<Button color="primary" variant="outlined">{"Login"}</Button>
			</NavLink>
		</div>
	);
}

export default LoggedOutLinks;
