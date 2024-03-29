import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";

import {
	Grid,
	FormControlLabel,
	FormControl,
	Checkbox,
	Button,
	Typography,
	Box,
	MenuItem,
} from "@material-ui/core";

import { Carousel } from "react-carousel-minimal";

import Input from "../.partials/Input";
import DeleteConfirmation from "../.partials/DeleteConfirmation";

import { UserContext } from "../../contexts/UserContext";
import { AppContext } from "../../contexts/AppContext";
import { YoutubeContext } from "../../contexts/YoutubeContext";

import { deleteApp } from "../../api/apps";
import { editUser } from "../../api/users";

import { translate } from "../../utils/translations";

function Settings() {
	const { user, dispatch } = useContext(UserContext);
	const {
		state: { allApps, apps },
		dispatch: appDispatch,
	} = useContext(AppContext);
	const {
		state: { playlists },
	} = useContext(YoutubeContext);
	const [settings, setSettings] = useState({});
	const [selectedApp, setSelectedApp] = useState(null);
	const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
	const [email, setEmail] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [repeatNewPassword, setRepeatNewPassword] = useState("");
	const [isMounted, setIsMounted] = useState(false);

	const images = [
		{
			image: "https://www.internetmatters.org/wp-content/uploads/2021/04/TwitchGuide-1200x630-1-600x315.jpg",
		},
		{
			image:
				"https://www.oficinadanet.com.br/imagens/post/37826/750xNxcapa-youtube-premium-oferece-3-meses-de-teste-no-discord-nitro-e-vice-versa.jpg.pagespeed.ic.5d718584c4.jpg",
		},
	];

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

	useEffect(() => {
		if (isMounted) handleSubmitSettings();
	}, [settings]);

	useEffect(() => {
		setSettings({ ...user.settings, browserNotifications: Notification.permission });
	}, []);

	useEffect(() => {
		setEmail(user.email);

		async function fetchData() {
			const notificationPermission = await navigator.permissions.query({ name: "notifications" });

			notificationPermission.onchange = () => {
				setSettings({ ...settings, browserNotifications: Notification.permission });
			};

			setIsMounted(true);
		}

		fetchData();
	}, []);

	async function handleDeleteApp() {
		const response = await deleteApp(selectedApp._id);

		if (response.status === 200) {
			appDispatch({ type: "DELETE_APP", app: response.data });

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

	function handleOpenDeleteConfirmation(app) {
		setSelectedApp(app);

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
		const userApp = apps.find(a => a.platform === app.platform);

		return (
			<Box key={app.key} style={{ backgroundColor: "#333333", borderRadius: "7px", width: "100%" }}>
				<Box p={2} mb={1} display="flex">
					<Box mr={2}>
						<Box p={2} padding="7px" borderRadius="7px" style={{ background: app.color }}>
							<i className={`${app.icon} icon-2x`} style={{ fontSize: "50px" }} />
						</Box>
					</Box>
					<Box flexGrow={1}>
						<Box display="flex" alignItems="flex-start" mb={1}>
							<Box flexGrow={1}>
								<Typography style={{ fontSize: "20px" }}> {app.displayName} </Typography>
								{userApp ? (
									<Typography variant="body2" style={{ color: "#BFBFBF", fontWeight: "700", fontSize: "15px" }}>
										{translate("appConnected", app.displayName)}
									</Typography>
								) : (
									<Typography style={{ color: "#BFBFBF", fontWeight: "700", fontSize: "15px" }} variant="body2">
										{translate("appNotConnected", app.displayName)}
									</Typography>
								)}
							</Box>
							{userApp ? (
								<Button
									color="primary"
									variant="contained"
									size="small"
									style={{ backgroundColor: "#ff000000", marginTop: "20px", boxShadow: "none" }}
									onClick={() => handleOpenDeleteConfirmation(userApp)}
								>
									<i className="icon-close-circled icon-2x" style={{ color: "#B7B7B8", fontSize: "22px" }} />
								</Button>
							) : (
								<Button
									color="primary"
									variant="contained"
									size="small"
									href={app.link}
									target="_self"
									style={{ backgroundColor: "#ff000000", marginTop: "20px", boxShadow: "none" }}
								>
									<i className="icon-circle-right icon-2x" style={{ color: "#B7B7B8", fontSize: "22px" }} />
								</Button>
							)}
						</Box>
					</Box>
				</Box>
			</Box>
		);
	}

	function renderApps() {
		return (
			<Grid item xs={12} lg={6}>
				<Typography style={{ fontSize: "25px", marginLeft: "10px", marginBottom: "15px" }}>
					{translate("availableApps")}
				</Typography>
				{Object.keys(allApps).map(app => renderApp(allApps[app]))}
			</Grid>
		);
	}

	function renderSettings() {
		return (
			<FormControl margin="normal">
				<Grid container spacing={3}>
					<Grid item xs={12} lg={6} style={{ marginTop: "20px" }}>
						<Typography variant="h4">{translate("settings")}</Typography>
						<Box style={{ backgroundColor: "#333333", borderRadius: "7px", marginTop: "20px", height: "276px" }}>
							<Grid container lg={12} style={{ padding: "30px 20px" }}>
								<Grid item xs={12} md={12} lg={12} style={{ paddingBottom: "15px" }}>
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
								</Grid>
								<Grid item xs={12} md={5} lg={4}>
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
								</Grid>
								<Grid item xs={12} md={5} lg={4}>
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
								</Grid>
								<Grid item xs={12} md={5} lg={4}>
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
								</Grid>
								<Grid item xs={12} md={5} lg={4}>
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
								</Grid>
								<Grid item xs={12} md={5} lg={4}>
									<FormControlLabel
										checked={settings.autoplayVideoPlayer || false}
										color="primary"
										control={<Checkbox color="primary" />}
										label={translate("autoplayVideoPlayer")}
										onChange={() => handleCheckboxChange("autoplayVideoPlayer")}
									/>
								</Grid>
							</Grid>
						</Box>
					</Grid>
					<Grid item xs={12} lg={6} style={{ marginTop: "20px" }}>
						<Typography variant="h4">{translate("account")}</Typography>
						<form onSubmit={handleSubmitSettings}>
							<Box style={{ backgroundColor: "#333333", borderRadius: "7px", marginTop: "20px" }}>
								<Grid container lg={12} style={{ padding: "30px 20px" }} spacing={1}>
									<Grid item xs={12} md={12} lg={6}>
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
									</Grid>

									<Grid item xs={12} md={12} lg={6}>
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
									</Grid>
									<Grid item xs={12} md={12} lg={6}>
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
									</Grid>

									<Grid item xs={12} md={12} lg={6}>
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
									</Grid>
									<Grid item xs={11} md={11} lg={12}>
										<Button
											variant="contained"
											type="submit"
											style={{
												color: "#fff",
												backgroundColor: "#F37555",
												float: "right",
												fontWeight: 600,
											}}
										>
											{translate("save")}
										</Button>
									</Grid>
								</Grid>
							</Box>
						</form>
					</Grid>
					{apps.find(app => app.platform === "tv") && (
						<Grid item xs={12} lg={6} style={{ marginTop: "20px" }}>
							<Typography variant="h4">{"TV"}</Typography>
							<Box style={{ backgroundColor: "#333333", borderRadius: "7px", marginTop: "20px", height: "116px" }}>
								<Grid container lg={12} style={{ padding: "30px 20px" }}>
									<Grid item xs={12} lg={6}>
										<FormControlLabel
											checked={settings.tv ? settings.tv.hideEpisodesThumbnails : false}
											color="primary"
											control={<Checkbox color="primary" />}
											label={translate("hideEpisodesThumbnails")}
											onChange={handleEpisodesThumbnailsChange}
										/>
									</Grid>
									<Grid item xs={12} lg={6}>
										<FormControlLabel
											checked={settings.tv ? settings.tv.hideEpisodesTitles : false}
											color="primary"
											control={<Checkbox color="primary" />}
											label={translate("hideEpisodesTitles")}
											onChange={handleEpisodesTitlesChange}
										/>
									</Grid>
								</Grid>
							</Box>
						</Grid>
					)}
					{apps.find(app => app.platform === "youtube") && (
						<Grid item xs={12} lg={6} style={{ marginTop: "20px" }}>
							<Typography variant="h4">{"Youtube"}</Typography>
							<Box style={{ backgroundColor: "#333333", borderRadius: "7px", marginTop: "20px" }}>
								<Grid container lg={12} style={{ padding: "30px 20px" }}>
									<Grid item xs={12} md={12} lg={12}>
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
									</Grid>
								</Grid>
							</Box>
						</Grid>
					)}
				</Grid>
			</FormControl>
		);
	}

	function renderImagesSlider() {
		return (
			<Grid item xs={12} lg={6}>
				<Box style={{ height: "100%" }}>
					<Carousel
						data={images}
						time={10000}
						width="850px"
						height="680px"
						radius="7px"
						automatic
						showNavBtn={false}
						dots
						slideImageFit="cover"
					/>
				</Box>
			</Grid>
		);
	}

	return (
		<div>
			<Grid container spacing={3} style={{ width: "100%", paddingLeft: "100px", paddingRight: "100px" }}>
				<Grid item xs={12} lg={12}>
					<Typography style={{ fontSize: "50px" }}> {translate("createYourPersonalHub")}</Typography>
				</Grid>

				{renderImagesSlider()}
				{renderApps()}
				{renderSettings()}
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
