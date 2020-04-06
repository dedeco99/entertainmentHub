import React from "react";
import { NavLink } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dropdown from "./NotificationDropdown";

import { logout } from "../../actions/auth";

function LoggedInLinks() {

	return (
		<div>
			<Dropdown />
			<NavLink className="nav-item" to="/settings" style={{ marginRight: 20 }}>
				<i className="icofont-ui-user" />
			</NavLink>
			<NavLink className="nav-item" to="/logout" onClick={logout}>
				<Button className="outlined-button" variant="outlined">{"Logout"}</Button>
			</NavLink>
		</div>
	);
}

export default LoggedInLinks;
