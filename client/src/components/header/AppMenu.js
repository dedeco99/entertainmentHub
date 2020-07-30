import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import { withStyles } from "@material-ui/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import { UserContext } from "../../contexts/UserContext";

import { getApps } from "../../api/apps";

import { appMenu as styles } from "../../styles/Header";
import { Typography } from "@material-ui/core";

function AppMenu({ classes, location }) {
	const { user, dispatch } = useContext(UserContext);
	const [apps, setApps] = useState([]);
	const [selectedMenu, setSelectedMenu] = useState(null);

	const allApps = [
		{ platform: "reddit", name: "Reddit", icon: "icofont-reddit icofont-2x", endpoint: "/reddit" },
		{ platform: "youtube", name: "Youtube", icon: "icofont-youtube-play icofont-2x", endpoint: "/youtube" },
		{ platform: "twitch", name: "Twitch", icon: "icofont-twitch icofont-2x", endpoint: "/twitch" },
		{ platform: "tv", name: "TV Series", icon: "icofont-monitor icofont-2x", endpoint: "/tv" },
	];

	async function getAppsCall() {
		const redirected = localStorage.getItem("redirected");

		const response = await getApps();

		if (response.data && response.data.length) {
			const userApps = allApps.filter(app => response.data.find(appR => appR.platform === app.platform));
			dispatch({ type: "SET_APPS", apps: response.data });
			setApps(userApps);
		} else if (!redirected) {
			localStorage.setItem("redirected", true);
			window.location.replace("/settings");
		}
	}

	useEffect(() => {
		async function fetchData() {
			if (user && user.token) await getAppsCall();
		}

		fetchData();
	}, []); // eslint-disable-line

	useEffect(() => {
		const currentApp = allApps.find(app => app.endpoint === location.pathname);
		setSelectedMenu(currentApp ? currentApp.platform : null);
	}, [allApps, location]);

	function renderAppList() {
		return apps.map(app => (
			<ListItem
				key={app.platform}
				button
				selected={selectedMenu === app.platform}
				className={classes.appItem}
				component={Link}
				to={app.endpoint}
			>
				<Typography color="textPrimary">
					<i className={app.icon} />
				</Typography>
			</ListItem >
		));
	}

	function renderAddMoreApps() {
		if (apps.length === allApps.length) return null;

		return (
			<ListItem button className={classes.appItem} component={Link} to="/settings/apps">
				<i className="icofont-plus-circle icofont-2x" />
			</ListItem >
		);
	}

	if (user && user.token) {
		return (
			<div className={classes.root}>
				<List>
					{renderAppList()}
					{renderAddMoreApps()}
				</List>
			</div>
		);
	}

	return <div />;
}

AppMenu.propTypes = {
	classes: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(AppMenu));
