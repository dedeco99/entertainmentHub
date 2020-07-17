import React, { Component } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import { withStyles } from "@material-ui/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import { UserContext } from "../../contexts/UserContext";

import { getApps } from "../../api/apps";

import { appMenu as styles } from "../../styles/Header";
import { Typography } from "@material-ui/core";

class AppMenu extends Component {
	constructor() {
		super();
		this.state = {
			apps: [],

			allApps: [
				{ platform: "reddit", name: "Reddit", icon: "icofont-reddit icofont-2x", endpoint: "/reddit" },
				{ platform: "youtube", name: "Youtube", icon: "icofont-youtube-play icofont-2x", endpoint: "/youtube" },
				{ platform: "twitch", name: "Twitch", icon: "icofont-twitch icofont-2x", endpoint: "/twitch" },
				{ platform: "tv", name: "TV Series", icon: "icofont-monitor icofont-2x", endpoint: "/tv" },
			],

			selectedMenu: null,
		};

		this.getApps = this.getApps.bind(this);
		this.handleAppClick = this.handleAppClick.bind(this);
	}

	componentDidMount() {
		const { user } = this.context;

		if (user && user.token) this.getApps();
	}

	async getApps() {
		const { dispatch } = this.context;
		const { allApps } = this.state;

		const redirected = localStorage.getItem("redirected");

		const response = await getApps();

		if (response.data && response.data.length) {
			const userApps = allApps.filter(app => response.data.find(appR => appR.platform === app.platform));

			const currentApp = allApps.find(app => app.endpoint === window.location.pathname);

			dispatch({ type: "SET_APPS", apps: response.data });

			this.setState({
				apps: userApps,
				selectedMenu: currentApp ? currentApp.platform : null,
			});
		} else if (!redirected) {
			localStorage.setItem("redirected", true);
			window.location.replace("/settings");
		}
	}

	handleAppClick(id) {
		this.setState({ selectedMenu: id });
	}

	renderAppList() {
		const { classes } = this.props;
		const { apps, selectedMenu } = this.state;

		return apps.map(app => (
			<NavLink
				className={classes.appLink}
				key={app.platform}
				to={app.endpoint}
				onClick={() => this.handleAppClick(app.platform)}
			>
				<ListItem
					button
					selected={selectedMenu === app.platform}
					className={classes.appItem}
				>
					<Typography color="textPrimary">
						<i className={app.icon} />
					</Typography>
				</ListItem >
			</NavLink>
		));
	}

	renderAddMoreApps() {
		const { classes } = this.props;
		const { apps, allApps } = this.state;

		if (apps.length === allApps.length) return null;

		return (
			<NavLink
				className={classes.appLink}
				to={"/settings"}
				onClick={() => this.handleAppClick("settings")}
			>
				<ListItem button className={classes.appItem}>
					<i className="icofont-plus-circle icofont-2x" />
				</ListItem >
			</NavLink>
		);
	}

	render() {
		const { user } = this.context;
		const { classes } = this.props;

		if (user && user.token) {
			return (
				<div className={classes.root}>
					<List>
						{this.renderAppList()}
						{this.renderAddMoreApps()}
					</List>
				</div>
			);
		}

		return <div />;
	}
}

AppMenu.contextType = UserContext;

AppMenu.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppMenu);
