import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

import { getApps, deleteApp } from "../../api/auth";
import { editSettings } from "../../api/settings";

import reddit from "../../img/reddit.png";
import twitch from "../../img/twitch.png";
import youtube from "../../img/youtube.png";
import tv from "../../img/tv.png";

import { settings as styles } from "../../styles/Header";

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
						&redirect_uri=http://localhost:3000/apps/reddit
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
						&redirect_uri=http://localhost:3000/apps/twitch
						&scope=user_read`,
				},
				youtube: {
					active: false,
					key: "youtube",
					displayName: "Youtube",
					link: `https://accounts.google.com/o/oauth2/v2/auth
						?redirect_uri=http://localhost:3000/apps/google
						&prompt=consent
						&access_type=offline
						&response_type=code
						&client_id=769835198677-vn6mkg9odjt6p08a2ph0jslssdgbtnaj.apps.googleusercontent.com
						&scope=https://www.googleapis.com/auth/youtube.readonly`,
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

		this.handleSettingsClick = this.handleSettingsClick.bind(this);
		this.changeScrollbar = this.changeScrollbar.bind(this);
		this.editSettings = this.editSettings.bind(this);
	}

	componentDidMount() {
		this.getApps();
		this.getSettings();
	}

	getSettings() {
		const user = JSON.parse(localStorage.getItem("user"));
		this.setState({ settings: user.settings });
	}

	async editSettings() {
		const { settings } = this.state;

		const response = await editSettings(settings);

		const user = JSON.parse(localStorage.getItem("user"));
		user.settings = response.data;
		localStorage.setItem("user", JSON.stringify(user));
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

	handleSettingsClick() {
		this.setState({ selectedMenu: 0 });
	}

	changeScrollbar() {
		const { settings } = this.state;
		settings.useCustomScrollbar = !settings.useCustomScrollbar;
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
						<i className="delete material-icons" id={app.id} onClick={this.handleDeleteApp}>
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

	render() {
		const { classes } = this.props;
		const { apps, selectedMenu, settings } = this.state;

		return (
			<div>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={4} md={3} lg={2}>
						<List className="list-menu">
							<ListItem
								button
								selected={selectedMenu === 0}
								onClick={this.handleSettingsClick}
							>
								<ListItemIcon>
									<i className={`material-icons ${classes.appIcon}`}>{"apps"}</i>
								</ListItemIcon>
								<ListItemText primary="Apps" />
							</ListItem>
						</List>
					</Grid>
					<Grid item xs={12} sm={8} md={9} lg={10}>
						<Grid container spacing={2}>
							{Object.keys(apps).map(app => this.renderApp(apps[app]))}
						</Grid>
					</Grid>
				</Grid >
				<div style={{ marginTop: 10, padding: 16, backgroundColor: "#212121" }}>
					<FormControlLabel
						control={<Checkbox checked={settings.useCustomScrollbar || false} onChange={this.changeScrollbar} />}
						label="Use custom scrollbar"
					/>
					<Button onClick={this.editSettings}> {"Save"} </Button>
				</div>
			</div>
		);
	}
}

Settings.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);
