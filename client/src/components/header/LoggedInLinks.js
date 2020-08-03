import React from "react";

import { makeStyles } from "@material-ui/core";

import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

import { loggedInLinks as styles } from "../../styles/Header";

const useStyles = makeStyles(styles);

function LoggedInLinks() {
	const classes = useStyles();

	return (
		<div className={classes.wrapper}>
			<NotificationDropdown />
			<UserDropdown />
		</div>
	);
}

export default LoggedInLinks;
