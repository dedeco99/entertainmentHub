import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";

import { UserContext } from "../../contexts/UserContext";

import { getApps, deleteApp } from "../../api/apps";
import { editUser } from "../../api/users";

import { settings as styles } from "../../styles/Header";

function Settings({ classes, match }) {
	const REDIRECT = "https://entertainmenthub.ddns.net";

	const { user, dispatch } = useContext(UserContext);

	const [apps, setApps] = useState({
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
	});
	const [selectedMenu, setSelectedMenu] = useState(0);
	const [settings, setSettings] = useState({});

	async function getAppsCall() {
		const response = await getApps();

		if (response.status === 200) {
			for (const userApp of response.data) {
				apps[userApp.platform].id = userApp._id;
				apps[userApp.platform].active = true;
			}

			setApps({ ...apps });
		}
	}

	useEffect(() => {
		async function fetchData() {
			setSettings(user.settings || {});
			await getAppsCall();
		}

		fetchData();
	}, []); // eslint-disable-line

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

			window.location.replace("/settings");
		}
	}

	async function handleDeleteApp(appId) {
		await deleteApp(appId);
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
										{" "}
										<i className="icofont-check-circled" /> {`Your ${app.displayName} is connected`}{" "}
									</Typography>
								) : (
									<Typography variant="body2">
										{" "}
										<i className="icofont-close-circled" /> {`Your ${app.displayName} is not currently connected`}{" "}
									</Typography>
								)}
							</Box>
							{app.active ? (
								<Button color="primary" variant="contained" size="small" onClick={() => handleDeleteApp(app.id)}>
									{" "}
									{"Disconnect"}{" "}
								</Button>
							) : (
								<Button color="primary" variant="contained" size="small" href={app.link} target="_self">
									{" "}
									{"Connect"}{" "}
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
				<Typography variant="h4"> {"Change settings"} </Typography>
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
							label="Use custom scrollbar"
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={settings.animations || false}
									color="primary"
									onChange={() => handleCheckboxChange("animations")}
								/>
							}
							label="Animations"
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={settings.borderColor || false}
									color="primary"
									onChange={() => handleCheckboxChange("borderColor")}
								/>
							}
							label="Border color on widgets"
						/>
					</FormControl>
					<Button variant="contained" onClick={handleSubmitSettings}>
						{"Apply"}
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
							<ListItemText primary="Apps" />
						</ListItem>
						<ListItem button selected={selectedMenu === 1} component={Link} to="/settings">
							<ListItemIcon>
								<i className={`material-icons ${classes.appIcon}`}>{"settings"}</i>
							</ListItemIcon>
							<ListItemText primary="Settings" />
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

Settings.propTypes = {
	classes: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);
