import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import GridLayout from "react-grid-layout";

import { makeStyles, List, ListItem, Typography, Box } from "@material-ui/core";

import Loading from "../.partials/Loading";
import Actions from "./Actions";

import { UserContext } from "../../contexts/UserContext";

import { getApps, patchApp } from "../../api/apps";

import { appMenu as styles } from "../../styles/Header";

const useStyles = makeStyles(styles);

function AppMenu() {
	const history = useHistory();
	const location = useLocation();
	const classes = useStyles();
	const { user, dispatch } = useContext(UserContext);
	const [selectedMenu, setSelectedMenu] = useState(null);
	const [loading, setLoading] = useState(false);

	const allApps = [
		{ platform: "reddit", name: "Reddit", icon: "icon-reddit-filled icon-2x", endpoint: "/reddit" },
		{ platform: "youtube", name: "Youtube", icon: "icon-youtube-filled icon-2x", endpoint: "/youtube" },
		{ platform: "twitch", name: "Twitch", icon: "icon-twitch-filled icon-2x", endpoint: "/twitch" },
		{ platform: "tv", name: "TV Series", icon: "icon-monitor-filled icon-2x", endpoint: "/tv" },
	];
	const fixedApps = [
		{ platform: "reminders", name: "Reminders", icon: "icon-notifications icon-2x", endpoint: "/reminders" },
	];

	useEffect(() => {
		async function fetchData() {
			if (user && user.token) {
				setLoading(true);

				const redirected = localStorage.getItem("redirected");

				const response = await getApps();

				if (response.status === 200) {
					const apps = response.data
						.filter(app => allApps.find(a => a.platform === app.platform))
						.map(app => ({ ...app, ...allApps.find(a => a.platform === app.platform) }));

					dispatch({ type: "SET_APPS", apps });
				} else if (!redirected) {
					localStorage.setItem("redirected", true);

					history.push("/settings");
				}

				setLoading(false);
			}
		}

		fetchData();
	}, []);

	useEffect(() => {
		const currentApp = allApps.find(app => location.pathname.includes(app.endpoint));
		setSelectedMenu(currentApp ? currentApp.platform : null);
	}, [allApps, location]);

	async function handleOrderChange(layout, oldItem, newItem) {
		const app = user.apps.find(a => a.platform === oldItem.i);

		await patchApp(app._id, { pos: newItem.y });
	}

	function renderAppList() {
		if (loading) return <Loading />;

		return (
			<Box display="flex" flexDirection="column" height="100%">
				<Box flexGrow={1}>
					<GridLayout
						className="layout"
						cols={1}
						rowHeight={55}
						width={50}
						margin={[0, 0]}
						isResizable={false}
						onDragStart={(layout, oldItem, newItem, placeholder, e) => {
							e.stopPropagation();
						}}
						onDragStop={handleOrderChange}
						draggableHandle=".handleListItem"
					>
						{user.apps &&
							user.apps.map((app, i) => (
								<div
									key={app.platform}
									data-grid={{
										x: 0,
										y: isNaN(app.pos) ? i : app.pos,
										w: 1,
										h: 1,
									}}
								>
									<ListItem
										key={app.platform}
										button
										selected={selectedMenu === app.platform}
										className={`${classes.appItem} handleListItem`}
										component={Link}
										to={app.endpoint}
									>
										<Typography>
											<i className={app.icon} />
										</Typography>
									</ListItem>
								</div>
							))}
					</GridLayout>
					{fixedApps.map(app => (
						<ListItem
							key={app.platform}
							button
							selected={selectedMenu === app.platform}
							className={`${classes.appItem} handleListItem`}
							onClick={() => history.push(app.endpoint)}
						>
							<Typography>
								<i className={app.icon} />
							</Typography>
						</ListItem>
					))}
				</Box>
				<Actions />
			</Box>
		);
	}

	function renderAddMoreApps() {
		if (!user.apps || user.apps.length === allApps.length) return null;

		return (
			<ListItem button className={classes.appItem} component={Link} to="/settings/apps">
				<i className="icon-add icon-2x" />
			</ListItem>
		);
	}

	return (
		<div className={classes.root}>
			<List style={{ height: "100%" }}>
				{renderAppList()}
				{renderAddMoreApps()}
			</List>
		</div>
	);
}
export default AppMenu;
