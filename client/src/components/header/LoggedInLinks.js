import React, { useContext } from "react";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import NotificationDropdown from "./NotificationDropdown";

import { UserContext } from "../../contexts/UserContext";

import { logout } from "../../api/auth";

import { loggedInLinks as styles } from "../../styles/Header";

function LoggedInLinks({ classes }) {
	const { user } = useContext(UserContext);

	return (
		<div>
			<NotificationDropdown />
			<NavLink className={`nav-item ${classes.navBtn}`} to="/settings">
				<Tooltip title={user.email}>
					<IconButton>
						<i className="icofont-ui-user" />
					</IconButton>
				</Tooltip>
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
