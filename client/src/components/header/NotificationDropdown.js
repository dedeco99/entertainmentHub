import React, { useContext, useState } from "react";

import { makeStyles, Paper, ClickAwayListener, IconButton, Grow, Badge } from "@material-ui/core";

import Notifications from "../widgets/Notifications";

import { NotificationContext } from "../../contexts/NotificationContext";

import { notificationDropdown as styles } from "../../styles/Header";

const useStyles = makeStyles(styles);

function NotificationDropdown() {
	const classes = useStyles();
	const { notificationState } = useContext(NotificationContext);
	const { total } = notificationState;
	const [open, setOpen] = useState(false);

	function handleClick() {
		setOpen(!open);
	}

	function handleClickAway(e) {
		if (!e.target.id.includes("filter-")) {
			setOpen(false);
		}
	}

	return (
		<ClickAwayListener onClickAway={handleClickAway}>
			<div className={classes.wrapper}>
				<Badge badgeContent={total} max={999} overlap="circle" color="error">
					<IconButton color="primary" onClick={handleClick}>
						<i className="icofont-alarm" />
					</IconButton>
				</Badge>
				<Grow in={open} style={{ transformOrigin: "right top" }}>
					<Paper variant="outlined" className={classes.paper}>
						<Notifications height={"50vh"} />
					</Paper>
				</Grow>
			</div>
		</ClickAwayListener>
	);
}

export default NotificationDropdown;
