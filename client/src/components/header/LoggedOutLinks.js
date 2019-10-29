import React from "react";
import { NavLink } from "react-router-dom";
import Button from "@material-ui/core/Button";

function LoggedOutLinks() {
	return (
		<div>
			<NavLink className="nav-item" to="/register" style={{ marginRight: 20 }}>
				<Button className="outlined-button" variant="outlined">Register</Button>
			</NavLink>
			<NavLink className="nav-item" to="/login">
				<Button className="outlined-button" variant="outlined">Login</Button>
			</NavLink>
		</div>
	);
};

export default LoggedOutLinks;
