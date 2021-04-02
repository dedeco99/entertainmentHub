import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import { makeStyles, List, ListItem, Typography } from "@material-ui/core";

import Loading from "../.partials/Loading";

import { UserContext } from "../../contexts/UserContext";

import { getApps } from "../../api/apps";

import { appMenu as styles } from "../../styles/Header";

const useStyles = makeStyles(styles);

function AppMenu() {
	const history = useHistory();
	const location = useLocation();
	const classes = useStyles();
	const { user, dispatch } = useContext(UserContext);
	const [apps, setApps] = useState([]);
	const [selectedMenu, setSelectedMenu] = useState(null);
	const [loading, setLoading] = useState(false);

	const allApps = [
		{ platform: "reddit", name: "Reddit", icon: "icon-reddit-filled icon-2x", endpoint: "/reddit" },
		{ platform: "youtube", name: "Youtube", icon: "icon-youtube-filled icon-2x", endpoint: "/youtube" },
		{ platform: "twitch", name: "Twitch", icon: "icon-twitch-filled icon-2x", endpoint: "/twitch" },
		{ platform: "tv", name: "TV Series", icon: "icon-monitor-filled icon-2x", endpoint: "/tv" },
	];
	const fixedApps = [
		{ platform: "reminders", name: "Reminders", icon: "icon-monitor-filled icon-2x", endpoint: "/reminders" },
	];

	useEffect(() => {
		async function fetchData() {
			if (user && user.token) {
				setLoading(true);

				const redirected = localStorage.getItem("redirected");

				const response = await getApps();

				if (response.status === 200) {
					const userApps = allApps.filter(app => response.data.find(appR => appR.platform === app.platform));
					userApps.push(...fixedApps);
					setApps(userApps);

					dispatch({ type: "SET_APPS", apps: response.data });
				} else if (!redirected) {
					localStorage.setItem("redirected", true);

					history.push("/settings");
				}

				setLoading(false);
			}
		}

		fetchData();
	}, []); // eslint-disable-line

	useEffect(() => {
		if (!user.apps) return;

		const userApps = allApps.filter(app => user.apps.find(appR => appR.platform === app.platform));
		userApps.push(...fixedApps);
		setApps(userApps);
	}, [user]); // eslint-disable-line

	useEffect(() => {
		const currentApp = allApps.find(app => app.endpoint === location.pathname);
		setSelectedMenu(currentApp ? currentApp.platform : null);
	}, [allApps, location]);

	function renderAppList() {
		if (loading) return <Loading />;

		return apps.map(app => (
			<ListItem
				key={app.platform}
				button
				selected={selectedMenu === app.platform}
				className={classes.appItem}
				component={Link}
				to={app.endpoint}
			>
				<Typography>
					<i className={app.icon} />
				</Typography>
			</ListItem>
		));
	}

	function renderAddMoreApps() {
		if (apps.length === allApps.length) return null;

		return (
			<ListItem button className={classes.appItem} component={Link} to="/settings/apps">
				<i className="icon-add icon-2x" />
			</ListItem>
		);
	}

	return (
		<div className={classes.root}>
			<List>
				{renderAppList()}
				{renderAddMoreApps()}
			</List>
		</div>
	);
}
export default AppMenu;
