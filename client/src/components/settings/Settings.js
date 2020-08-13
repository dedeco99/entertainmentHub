import React, { useState, useEffect, useContext } from "react";
import { Link, useRouteMatch } from "react-router-dom";

import {
	makeStyles,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	FormControlLabel,
	FormControl,
	Checkbox,
	Button,
	Typography,
	Box,
	Paper,
	Divider,
} from "@material-ui/core";

import { UserContext } from "../../contexts/UserContext";

import { deleteApp } from "../../api/apps";
import { editUser } from "../../api/users";

import { translate } from "../../utils/translations";

import { settings as styles } from "../../styles/Header";

const useStyles = makeStyles(styles);

function Settings() {
	const REDIRECT = "https://entertainmenthub.ddns.net";

	const match = useRouteMatch();
	const classes = useStyles();
	const { user, dispatch } = useContext(UserContext);

	const apps = {
		reddit: {
			active: false,
			key: "reddit",
			displayName: "Reddit",
			icon: "icofont-reddit",
			link: `https://www.reddit.com/api/v1/authorize
				?client_id=VXMNKvXfKALA3A
				&response_type=code
				&state=some_state
				&redirect_uri=${REDIRECT}/apps/reddit
				&duration=permanent
				&scope=read`,
			color: "#fd4500",
		},
		twitch: {
			active: false,
			key: "twitch",
			displayName: "Twitch",
			icon: "icofont-twitch",
			link: `https://api.twitch.tv/kraken/oauth2/authorize
				?client_id=9haxv452ih4k8ewiml53vqetrbm0z9q
				&response_type=code
				&redirect_uri=${REDIRECT}/apps/twitch
				&scope=user_read`,
			color: "#6441a5",
		},
		youtube: {
			active: false,
			key: "youtube",
			displayName: "Youtube",
			icon: "icofont-youtube-play",
			link: `https://accounts.google.com/o/oauth2/v2/auth
				?redirect_uri=${REDIRECT}/apps/youtube
				&prompt=consent
				&access_type=offline
				&response_type=code
				&client_id=539994951120-kabifq9ct2lbk92m9ef4hddc5f57nksl.apps.googleusercontent.com
				&scope=https://www.googleapis.com/auth/youtube`,
			color: "linear-gradient(0deg, rgba(226,43,40,1) 0%, rgba(191,31,19,1) 100%)",
		},
		tv: {
			active: false,
			key: "tv",
			displayName: "TV",
			icon: "icofont-monitor",
			link: "/apps/tv",
			color: "linear-gradient(0deg, rgba(1,97,234,1) 0%, rgba(0,187,250,1) 100%)",
		},
	};
	const [selectedMenu, setSelectedMenu] = useState(0);
	const [settings, setSettings] = useState({});

	for (const userApp of user.apps) {
		apps[userApp.platform].id = userApp._id;
		apps[userApp.platform].active = true;
	}

	useEffect(() => {
		switch (match.path) {
			case "/settings/apps":
				setSelectedMenu(0);
				break;
			case "/settings":
				setSelectedMenu(1);
				break;
			default:
				break;
		}
	}, [match]);

	async function handleSubmitSettings() {
		const response = await editUser({ settings });

		if (response.status === 200) {
			dispatch({ type: "SET_USER", user: { ...user, ...response.data } });
		}
	}

	async function handleDeleteApp(appId) {
		const response = await deleteApp(appId);

		if (response.status === 200) {
			dispatch({ type: "DELETE_APP", app: response.data });
		}
	}

	function handleCheckboxChange(property) {
		setSettings({ ...settings, [property]: !settings[property] });
	}

	function renderApp(app) {
		return (
			<Box key={app.key}>
				<Box p={2} mb={1} display="flex">
					<Box mr={2}>
						<Box p={2} borderRadius="4px" style={{ background: app.color }}>
							<i className={`${app.icon} icofont-3x`} />
						</Box>
					</Box>
					<Box flexGrow={1}>
						<Box display="flex" alignItems="flex-start" mb={1}>
							<Box flexGrow={1}>
								<Typography> {app.displayName} </Typography>
								{app.active ? (
									<Typography variant="body2">
										<i className="icofont-check-circled" /> {translate("appConnected", app.displayName)}
									</Typography>
								) : (
									<Typography variant="body2">
										<i className="icofont-close-circled" /> {translate("appNotConnected", app.displayName)}
									</Typography>
								)}
							</Box>
							{app.active ? (
								<Button color="primary" variant="contained" size="small" onClick={() => handleDeleteApp(app.id)}>
									{translate("disconnect")}
								</Button>
							) : (
								<Button color="primary" variant="contained" size="small" href={app.link} target="_self">
									{translate("connect")}
								</Button>
							)}
						</Box>
						<Typography variant="caption">
							{
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut cursus tortor nec ex sodales, vitae malesuada metus mollis. Nullam consectetur egestas fringilla. Nullam turpis sapien, sodales et ex nec, mollis vestibulum odio. Vestibulum sed dui orci."
							}
						</Typography>
					</Box>
				</Box>
				<Divider />
			</Box>
		);
	}

	function renderApps() {
		return <Paper>{Object.keys(apps).map(app => renderApp(apps[app]))}</Paper>;
	}

	function renderSettings() {
		return (
			<div className={classes.settingsContainer}>
				<Typography variant="h4">{translate("settings")}</Typography>
				<form onSubmit={handleSubmitSettings} style={{ display: "contents" }}>
					<FormControl margin="normal">
						<FormControlLabel
							control={
								<Checkbox
									checked={settings.useCustomScrollbar || false}
									color="primary"
									onChange={() => handleCheckboxChange("useCustomScrollbar")}
								/>
							}
							label={translate("customScrollbar")}
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={settings.animations || false}
									color="primary"
									onChange={() => handleCheckboxChange("animations")}
								/>
							}
							label={translate("animations")}
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={settings.borderColor || false}
									color="primary"
									onChange={() => handleCheckboxChange("borderColor")}
								/>
							}
							label={translate("borderColor")}
						/>
					</FormControl>
					<Button variant="contained" onClick={handleSubmitSettings}>
						{translate("save")}
					</Button>
				</form>
			</div>
		);
	}

	function renderContent() {
		switch (selectedMenu) {
			case 0:
				return renderApps();
			case 1:
				return renderSettings();
			default:
				return null;
		}
	}

	return (
		<div>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={4} md={3} lg={2}>
					<List className={classes.listMenu}>
						<ListItem button selected={selectedMenu === 0} component={Link} to="/settings/apps">
							<ListItemIcon>
								<i className={`material-icons ${classes.appIcon}`}>{"apps"}</i>
							</ListItemIcon>
							<ListItemText primary={translate("apps")} />
						</ListItem>
						<ListItem button selected={selectedMenu === 1} component={Link} to="/settings">
							<ListItemIcon>
								<i className={`material-icons ${classes.appIcon}`}>{"settings"}</i>
							</ListItemIcon>
							<ListItemText primary={translate("settings")} />
						</ListItem>
					</List>
				</Grid>
				<Grid item xs={12} sm={8} md={9} lg={10}>
					{renderContent()}
				</Grid>
			</Grid>
		</div>
	);
}

export default Settings;
