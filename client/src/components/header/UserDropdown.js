import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import {
	makeStyles,
	Paper,
	ClickAwayListener,
	Grow,
	Avatar,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
	Box,
	Divider,
} from "@material-ui/core";

import { UserContext } from "../../contexts/UserContext";

import { logout } from "../../api/auth";

import { userDropdown as styles } from "../../styles/Header";

const useStyles = makeStyles(styles);

function UserDropdown() {
	const history = useHistory();
	const classes = useStyles();
	const { user } = useContext(UserContext);
	const [open, setOpen] = useState(false);

	function handleClick() {
		setOpen(!open);
	}

	function handleClickAway() {
		setOpen(false);
	}

	function handleSettingsClick() {
		history.push("/settings");
	}

	function handleConnectionsClick() {
		history.push("/settings/apps");
	}

	function handleLogoutClick() {
		logout();
	}

	const options = [
		{
			title: "Settings",
			icon: "settings",
			handleClick: handleSettingsClick,
		},
		{
			title: "Apps",
			icon: "apps",
			handleClick: handleConnectionsClick,
		},
		{
			title: "Logout",
			icon: "exit_to_app",
			handleClick: handleLogoutClick,
		},
	];

	return (
		<ClickAwayListener onClickAway={handleClickAway}>
			<div className={classes.wrapper}>
				<IconButton size="small" onClick={handleClick}>
					<Avatar alt="Profile image" src={user.image} className={classes.avatar}>
						{"?"}
					</Avatar>
				</IconButton>
				<Grow in={open} style={{ transformOrigin: "right top" }}>
					<Paper variant="outlined" className={classes.paper}>
						<Box p={1}>
							<Typography variant="body1" align="center">
								{user.email}
							</Typography>
						</Box>
						<Divider />
						<List disablePadding>
							{options.map(op => (
								<ListItem key={op.title} button onClick={op.handleClick}>
									<ListItemIcon>
										<i className="material-icons">{op.icon}</i>
									</ListItemIcon>
									<ListItemText primary={op.title} />
								</ListItem>
							))}
						</List>
					</Paper>
				</Grow>
			</div>
		</ClickAwayListener>
	);
}

export default UserDropdown;
