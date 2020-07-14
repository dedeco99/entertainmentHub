import React from "react";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import NotificationDropdown from "./NotificationDropdown";

import { logout } from "../../api/auth";

import { loggedInLinks as styles } from "../../styles/Header";

function LoggedInLinks({ classes }) {
	return (
		<div>
			<NotificationDropdown />
			<NavLink className={`nav-item ${classes.navBtn}`} to="/settings">
				<IconButton color="primary">
					<i className="icofont-ui-user" />
				</IconButton>
			</NavLink>
			<NavLink className="nav-item" to="/logout" onClick={logout}>
				<Button className="outlined-button" variant="outlined">{"Logout"}</Button>
			</NavLink>
		</div>
	);
}

LoggedInLinks.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoggedInLinks);
