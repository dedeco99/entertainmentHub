import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";

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

import { UserContext } from "../../contexts/UserContext";

import { getApps, deleteApp } from "../../api/apps";
import { editUser } from "../../api/users";

import reddit from "../../img/reddit.png";
import twitch from "../../img/twitch.png";
import youtube from "../../img/youtube.png";
import tv from "../../img/tv.png";

import { settings as styles } from "../../styles/Header";

const REDIRECT = "https://entertainmenthub.ddns.net";

class Settings extends Component {
	constructor() {
		super();
		this.state = {
			apps: {
				reddit: {
					active: false,
					key: "reddit",
					displayName: "Reddit",
					link: `https://www.reddit.com/api/v1/authorize
						?client_id=VXMNKvXfKALA3A
						&response_type=code
						&state=some_state
						&redirect_uri=${REDIRECT}/apps/reddit
						&duration=permanent
						&scope=read`,
				},
				twitch: {
					active: false,
					key: "twitch",
					displayName: "Twitch",
					link: `https://api.twitch.tv/kraken/oauth2/authorize
						?client_id=9haxv452ih4k8ewiml53vqetrbm0z9q
						&response_type=code
						&redirect_uri=${REDIRECT}/apps/twitch
						&scope=user_read`,
				},
				youtube: {
					active: false,
					key: "youtube",
					displayName: "Youtube",
					link: `https://accounts.google.com/o/oauth2/v2/auth
						?redirect_uri=${REDIRECT}/apps/youtube
						&prompt=consent
						&access_type=offline
						&response_type=code
						&client_id=539994951120-kabifq9ct2lbk92m9ef4hddc5f57nksl.apps.googleusercontent.com
						&scope=https://www.googleapis.com/auth/youtube`,
				},
				tv: {
					active: false,
					key: "tv",
					displayName: "TV",
					link: "/apps/tv",
				},
			},

			selectedMenu: 0,
			settings: {},
		};

		this.handleListClick = this.handleListClick.bind(this);
		this.handleChangeScrollbar = this.handleChangeScrollbar.bind(this);
		this.handleAnimations = this.handleAnimations.bind(this);
		this.handleBorderColor = this.handleBorderColor.bind(this);
		this.handleSubmitSettings = this.handleSubmitSettings.bind(this);
	}

	componentDidMount() {
		this.getApps();
		this.getSettings();
	}

	getSettings() {
		const { user } = this.context;

		this.setState({ settings: user.settings || {} });
	}

	async handleSubmitSettings() {
		const { user, dispatch } = this.context;
		const { settings } = this.state;

		const response = await editUser({ settings });

		if (response.data) {
			dispatch({ type: "SET_USER", user: { ...user, ...response.data } });

			window.location.replace("/settings");
		}
	}

	async getApps() {
		const { apps } = this.state;

		const response = await getApps();

		if (response.data.length) {
			for (const userApp of response.data) {
				apps[userApp.platform].id = userApp._id;
				apps[userApp.platform].active = true;
			}

			this.setState({ apps });
		}
	}

	async handleDeleteApp(e) {
		await deleteApp(e.target.id);
	}

	handleListClick(index) {
		this.setState({ selectedMenu: index });
	}

	handleChangeScrollbar() {
		const { settings } = this.state;

		settings.useCustomScrollbar = !settings.useCustomScrollbar;

		this.setState({ settings });
	}

	handleAnimations() {
		const { settings } = this.state;

		settings.animations = !settings.animations;

		this.setState({ settings });
	}

	handleBorderColor() {
		const { settings } = this.state;

		settings.borderColor = !settings.borderColor;

		this.setState({ settings });
	}


	renderApp(app) {
		const { classes } = this.props;
		const images = {
			reddit,
			twitch,
			youtube,
			tv,
		};

		if (app.active) {
			return (
				<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={app.key}>
					<div className={classes.appsContainer}>
						<img src={images[app.key]} width="100%" alt={app.displayName} />
						<i className={`${classes.delete} material-icons`} id={app.id} onClick={this.handleDeleteApp}>
							{"delete"}
						</i>
					</div>
				</Grid>
			);
		}

		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={app.key}>
				<a href={app.link} target="_self">
					<img src={images[app.key]} width="100%" alt={app.displayName} />
				</a>
			</Grid>
		);
	}

	renderApps() {
		const { apps } = this.state;

		return (
			<Grid container spacing={2}>
				{Object.keys(apps).map(app => this.renderApp(apps[app]))}
			</Grid>
		);
	}

	renderSettings() {
		const { settings } = this.state;
		const { classes } = this.props;

		return (
			<div className={classes.settingsContainer}>
				<Typography variant="h4"> {"Change settings"} </Typography>
				<FormControl margin="normal">
					<FormControlLabel
						control={
							<Checkbox
								checked={settings.useCustomScrollbar || false}
								color="primary"
								onChange={this.handleChangeScrollbar}
							/>
						}
						label="Use custom scrollbar"
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={settings.animations || false}
								color="primary"
								onChange={this.handleAnimations}
							/>
						}
						label="Animations"
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={settings.borderColor || false}
								color="primary"
								onChange={this.handleBorderColor}
							/>
						}
						label="Border color on widgets"
					/>
				</FormControl>
				<Button variant="contained" onClick={this.handleSubmitSettings}> {"Apply"} </Button>
			</div>
		);
	}

	renderContent() {
		const { selectedMenu } = this.state;

		switch (selectedMenu) {
			case 0:
				return this.renderApps();
			case 1:
				return this.renderSettings();
			default:
				return null;
		}
	}

	render() {
		const { classes } = this.props;
		const { selectedMenu } = this.state;

		return (
			<div>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={4} md={3} lg={2}>
						<List className={classes.listMenu}>
							<ListItem
								button
								selected={selectedMenu === 0}
								onClick={() => this.handleListClick(0)}
							>
								<ListItemIcon>
									<i className={`material-icons ${classes.appIcon}`}>{"apps"}</i>
								</ListItemIcon>
								<ListItemText primary="Apps" />
							</ListItem>
							<ListItem
								button
								selected={selectedMenu === 1}
								onClick={() => this.handleListClick(1)}
							>
								<ListItemIcon>
									<i className={`material-icons ${classes.appIcon}`}>{"settings"}</i>
								</ListItemIcon>
								<ListItemText primary="Settings" />
							</ListItem>
						</List>
					</Grid>
					<Grid item xs={12} sm={8} md={9} lg={10}>
						{this.renderContent()}
					</Grid>
				</Grid >
			</div>
		);
	}
}

Settings.contextType = UserContext;

Settings.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);
