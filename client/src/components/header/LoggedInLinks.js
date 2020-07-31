import React from "react";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";

import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

import { loggedInLinks as styles } from "../../styles/Header";

function LoggedInLinks({ classes }) {
	return (
		<div className={classes.wrapper}>
			<NotificationDropdown />
			<UserDropdown />
		</div>
	);
}

LoggedInLinks.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoggedInLinks);
