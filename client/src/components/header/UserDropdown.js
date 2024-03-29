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
	Divider,
	MenuItem,
	Typography,
	Tooltip,
} from "@material-ui/core";

import Input from "../.partials/Input";

import { UserContext } from "../../contexts/UserContext";

import { logout } from "../../api/auth";
import { editUser } from "../../api/users";

import { translate } from "../../utils/translations";

import { userDropdown as styles } from "../../styles/Header";

const useStyles = makeStyles(styles);

function UserDropdown() {
	const history = useHistory();
	const classes = useStyles();
	const { user, dispatch } = useContext(UserContext);
	const [open, setOpen] = useState(false);

	async function handleChangeLanguage(e) {
		const response = await editUser({ language: e.target.value });

		if (response.status === 200) {
			dispatch({ type: "SET_USER", user: { ...user, ...response.data } });
		}
	}

	function handleClick() {
		setOpen(!open);
	}

	function handleClickAway() {
		setOpen(false);
	}

	function handleSettingsClick() {
		history.push("/settings");
	}

	function handleLogoutClick() {
		logout();
	}

	const options = [
		{
			title: translate("settings"),
			icon: "icon-settings icon-2x",
			handleClick: handleSettingsClick,
		},
		{
			title: translate("apps"),
			icon: "icon-apps icon-2x",
			handleClick: handleSettingsClick,
		},
		{
			title: translate("logout"),
			icon: "icon-logout icon-2x",
			handleClick: handleLogoutClick,
		},
	];

	return (
		<ClickAwayListener onClickAway={handleClickAway}>
			<div className={classes.wrapper}>
				<IconButton size="small" onClick={handleClick}>
					<Avatar alt={user.email} src={user.image} className={classes.avatar}>
						{user.email[0].toUpperCase()}
					</Avatar>
				</IconButton>
				<Grow in={open} style={{ transformOrigin: "right top" }}>
					<Paper variant="outlined" className={classes.paper}>
						<List disablePadding>
							<ListItem key="user">
								<ListItemIcon>
									<i className="icon-user icon-2x" />
								</ListItemIcon>
								<ListItemText>
									<Tooltip title={user.email} placement="top-start">
										<Typography noWrap>{user.email}</Typography>
									</Tooltip>
								</ListItemText>
							</ListItem>
							<Divider />
							<ListItem key={"langs"}>
								<ListItemIcon>
									<i className="icon-translate icon-2x" />
								</ListItemIcon>
								<Input
									value={user.language || "en"}
									onChange={handleChangeLanguage}
									SelectProps={{ MenuProps: { disablePortal: true } }}
									variant="outlined"
									size="small"
									select
									fullWidth
									style={{ height: "35px" }}
								>
									<MenuItem value={"pt"}>{translate("portugueseLang")}</MenuItem>
									<MenuItem value={"en"}>{translate("englishLang")}</MenuItem>
								</Input>
							</ListItem>
							{options.map(op => (
								<ListItem key={op.title} button onClick={op.handleClick}>
									<ListItemIcon>
										<i className={op.icon} />
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
