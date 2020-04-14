import React from "react";
import { NavLink } from "react-router-dom";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import NotificationDropdown from "./NotificationDropdown";

import { logout } from "../../api/auth";

function LoggedInLinks() {
	return (
		<div>
			<NotificationDropdown />
			<NavLink className="nav-item" to="/settings" style={{ marginRight: 20 }}>
				<IconButton>
					<i className="icofont-ui-user" />
				</IconButton>
			</NavLink>
			<NavLink className="nav-item" to="/logout" onClick={logout}>
				<Button className="outlined-button" variant="outlined">{"Logout"}</Button>
			</NavLink>
		</div>
	);
}

export default LoggedInLinks;
