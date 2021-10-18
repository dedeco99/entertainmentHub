import React, { useState, useEffect, useContext } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { toast } from "react-toastify";

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
	MenuItem,
} from "@material-ui/core";

import Input from "../.partials/Input";
import DeleteConfirmation from "../.partials/DeleteConfirmation";

import { UserContext } from "../../contexts/UserContext";
import { YoutubeContext } from "../../contexts/YoutubeContext";

import { deleteApp } from "../../api/apps";
import { editUser } from "../../api/users";

import { translate } from "../../utils/translations";

import { settings as styles } from "../../styles/Header";

const useStyles = makeStyles(styles);

function Settings() {
	const REDIRECT = process.env.REACT_APP_REDIRECT_URL;

	const match = useRouteMatch();
	const classes = useStyles();
	const { user, dispatch } = useContext(UserContext);
	const { state } = useContext(YoutubeContext);
	const { playlists } = state;

	const apps = {
		reddit: {
			active: false,
			key: "reddit",
			displayName: "Reddit",
			icon: "icon-reddit",
			link: `https://www.reddit.com/api/v1/authorize
				?client_id=VXMNKvXfKALA3A
				&response_type=code
				&state=some_state
				&redirect_uri=${REDIRECT}/apps/reddit
				&duration=permanent
				&scope=read,mysubreddits`,
			color: "#fd4500",
		},
		twitch: {
			active: false,
			key: "twitch",
			displayName: "Twitch",
			icon: "icon-twitch",
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
			icon: "icon-youtube-filled",
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
			icon: "icon-monitor",
			link: "/apps/tv",
			color: "linear-gradient(0deg, rgba(1,97,234,1) 0%, rgba(0,187,250,1) 100%)",
		},
		gmail: {
			active: false,
			key: "gmail",
			displayName: "Gmail",
			icon: "icon-monitor",
			link: `https://accounts.google.com/o/oauth2/v2/auth
				?redirect_uri=${REDIRECT}/apps/gmail
				&prompt=consent
				&access_type=offline
				&response_type=code
				&client_id=539994951120-kabifq9ct2lbk92m9ef4hddc5f57nksl.apps.googleusercontent.com
				&scope=https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify`,
			color: "linear-gradient(0deg, rgba(1,97,234,1) 0%, rgba(0,187,250,1) 100%)",
		},
	};
	const [selectedMenu, setSelectedMenu] = useState(0);
	const [settings, setSettings] = useState({});
	const [selectedApp, setSelectedApp] = useState(null);
	const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
	const [email, setEmail] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [repeatNewPassword, setRepeatNewPassword] = useState("");

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

		setSettings({ ...user.settings, browserNotifications: Notification.permission });
	}, [match]);

	useEffect(() => {
		setEmail(user.email);

		async function fetchData() {
			const notificationPermission = await navigator.permissions.query({ name: "notifications" });

			notificationPermission.onchange = () => {
				setSettings({ ...settings, browserNotifications: Notification.permission });
			};
		}

		fetchData();
	}, []);

	async function handleSubmitSettings() {
		const password = oldPassword;
		const body = { settings };

		const emailRegex =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (email !== user.email) {
			if (!emailRegex.test(email)) return toast.error("Email is incorrect");

			body.email = email;
		}

		if (newPassword === repeatNewPassword && password) {
			body.password = password;
			body.newPassword = newPassword;
		}

		const response = await editUser(body);

		if (response.status === 200) {
			dispatch({ type: "SET_USER", user: { ...user, ...response.data } });
		}

		return null;
	}

	async function handleDeleteApp() {
		const response = await deleteApp(selectedApp.id);

		if (response.status === 200) {
			dispatch({ type: "DELETE_APP", app: response.data });

			setOpenDeleteConfirmation(false);
		}
	}

	function handleCurrencyChange(e) {
		setSettings({ ...settings, currency: e.target.value });
	}

	function handleCheckboxChange(property) {
		setSettings({ ...settings, [property]: !settings[property] });
	}

	function handleWatchLaterPlaylistChange(e) {
		setSettings({ ...settings, youtube: { ...settings.youtube, watchLaterPlaylist: e.target.value } });
	}

	function handleEpisodesThumbnailsChange() {
		setSettings({
			...settings,
			tv: { ...settings.tv, hideEpisodesThumbnails: settings.tv ? !settings.tv.hideEpisodesThumbnails : true },
		});
	}

	function handleEpisodesTitlesChange() {
		setSettings({
			...settings,
			tv: { ...settings.tv, hideEpisodesTitles: settings.tv ? !settings.tv.hideEpisodesTitles : true },
		});
	}

	function handleOpenDeleteConfirmation(key) {
		setSelectedApp(apps[key]);

		setOpenDeleteConfirmation(true);
	}

	function handleCloseDeleteConfirmation() {
		setOpenDeleteConfirmation(false);
	}

	async function handleBrowserNotifications() {
		const notificationPermission = await navigator.permissions.query({ name: "notifications" });

		if (notificationPermission.state === "granted") {
			toast.error(translate("browserSettings"));
		} else {
			const browserNotifications = await Notification.requestPermission();

			setSettings({ ...settings, browserNotifications });
		}
	}

	function handleEmail(e) {
		setEmail(e.target.value);
	}

	function handleOldPassword(e) {
		setOldPassword(e.target.value);
	}

	function handleNewPassword(e) {
		setNewPassword(e.target.value);
	}

	function handleRepeatNewPassword(e) {
		setRepeatNewPassword(e.target.value);
	}

	function renderApp(app) {
		return (
			<Box key={app.key}>
				<Box p={2} mb={1} display="flex">
					<Box mr={2}>
						<Box p={2} borderRadius="4px" style={{ background: app.color }}>
							<i className={`${app.icon} icon-2x`} />
						</Box>
					</Box>
					<Box flexGrow={1}>
						<Box display="flex" alignItems="flex-start" mb={1}>
							<Box flexGrow={1}>
								<Typography> {app.displayName} </Typography>
								{app.active ? (
									<Typography variant="body2">
										<i className="icon-check-circled" /> {translate("appConnected", app.displayName)}
									</Typography>
								) : (
									<Typography variant="body2">
										<i className="icon-close-circled" /> {translate("appNotConnected", app.displayName)}
									</Typography>
								)}
							</Box>
							{app.active ? (
								<Button
									color="primary"
									variant="contained"
									size="small"
									onClick={() => handleOpenDeleteConfirmation(app.key)}
								>
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
						<Input
							label="Currency"
							value={settings.currency}
							onChange={handleCurrencyChange}
							variant="outlined"
							select
							fullWidth
						>
							{["EUR", "USD", "GBP"].map(c => (
								<MenuItem key={c} value={c}>
									{c}
								</MenuItem>
							))}
						</Input>
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
						<FormControlLabel
							control={
								<Checkbox
									checked={settings.browserNotifications === "granted"}
									disabled={settings.browserNotifications === "denied"}
									color="primary"
									onChange={handleBrowserNotifications}
								/>
							}
							label={translate("browserNotifications")}
						/>
						<FormControlLabel
							checked={settings.autoplayVideoPlayer || false}
							color="primary"
							control={<Checkbox color="primary" />}
							label={translate("autoplayVideoPlayer")}
							onChange={() => handleCheckboxChange("autoplayVideoPlayer")}
						/>
						<Divider style={{ marginTop: 20, marginBottom: 20 }} />
						<Typography variant="h6" style={{ marginBottom: 10 }}>
							{"Account"}
						</Typography>
						<Input
							id="email"
							type="email"
							label="Email"
							value={email}
							onChange={handleEmail}
							margin="normal"
							variant="outlined"
							fullWidth
						/>
						<br />
						<Input
							id="oldPassword"
							type="password"
							label="Old Password"
							value={oldPassword}
							onChange={handleOldPassword}
							margin="normal"
							variant="outlined"
							fullWidth
						/>
						<Input
							id="newPassword"
							type="password"
							label="New Password"
							value={newPassword}
							onChange={handleNewPassword}
							margin="normal"
							variant="outlined"
							fullWidth
						/>
						<Input
							id="repeatNewPassword"
							type="password"
							label="Repeat New Password"
							value={repeatNewPassword}
							onChange={handleRepeatNewPassword}
							margin="normal"
							variant="outlined"
							fullWidth
						/>
						{apps.tv.active && (
							<>
								<Divider style={{ marginTop: 20, marginBottom: 20 }} />
								<Typography variant="h6">{"TV"}</Typography>
								<FormControlLabel
									checked={settings.tv ? settings.tv.hideEpisodesThumbnails : false}
									color="primary"
									control={<Checkbox color="primary" />}
									label={translate("hideEpisodesThumbnails")}
									onChange={handleEpisodesThumbnailsChange}
								/>
								<FormControlLabel
									checked={settings.tv ? settings.tv.hideEpisodesTitles : false}
									color="primary"
									control={<Checkbox color="primary" />}
									label={translate("hideEpisodesTitles")}
									onChange={handleEpisodesTitlesChange}
								/>
							</>
						)}
						<FormControlLabel
							checked={settings.appHints || false}
							color="primary"
							control={<Checkbox color="primary" />}
							label={translate("appHints")}
							onChange={() => handleCheckboxChange("appHints")}
						/>
						{apps.youtube.active && (
							<>
								<Divider style={{ marginTop: 20, marginBottom: 20 }} />
								<Typography variant="h6" style={{ marginBottom: 10 }}>
									{"Youtube"}
								</Typography>
								<Input
									label="Youtube Watch Later Default Playlist"
									value={settings.youtube ? settings.youtube.watchLaterPlaylist : ""}
									onChange={handleWatchLaterPlaylistChange}
									variant="outlined"
									select
									fullWidth
								>
									{playlists.map(p => (
										<MenuItem key={p.externalId} value={p.externalId}>
											{p.displayName}
										</MenuItem>
									))}
								</Input>
							</>
						)}
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
								<i className={`icon-apps ${classes.appIcon}`} />
							</ListItemIcon>
							<ListItemText primary={translate("apps")} />
						</ListItem>
						<ListItem button selected={selectedMenu === 1} component={Link} to="/settings">
							<ListItemIcon>
								<i className={`icon-settings ${classes.appIcon}`} />
							</ListItemIcon>
							<ListItemText primary={translate("settings")} />
						</ListItem>
					</List>
				</Grid>
				<Grid item xs={12} sm={8} md={9} lg={10}>
					{renderContent()}
				</Grid>
			</Grid>
			<DeleteConfirmation
				open={openDeleteConfirmation}
				onClose={handleCloseDeleteConfirmation}
				onDelete={handleDeleteApp}
				type={selectedApp && selectedApp.displayName}
			/>
		</div>
	);
}

export default Settings;
