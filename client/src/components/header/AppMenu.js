import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import GridLayout from "react-grid-layout";

import { makeStyles, List, ListItem, Typography, Box } from "@material-ui/core";

import Loading from "../.partials/Loading";
import Actions from "./Actions";

import { AppContext } from "../../contexts/AppContext";

import { getApps, patchApp } from "../../api/apps";

import { appMenu as styles } from "../../styles/Header";

const useStyles = makeStyles(styles);

function AppMenu() {
	const history = useHistory();
	const location = useLocation();
	const classes = useStyles();
	const { state, dispatch } = useContext(AppContext);
	const { allApps, apps } = state;
	const [selectedMenu, setSelectedMenu] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);

			const redirected = localStorage.getItem("redirected");

			const response = await getApps();

			if (response.status === 200) {
				dispatch({ type: "SET_APPS", apps: response.data });
			} else if (!redirected) {
				localStorage.setItem("redirected", true);

				history.push("/settings");
			}

			setLoading(false);
		}

		fetchData();
	}, []);

	useEffect(() => {
		const currentApp = apps.find(app => location.pathname.includes(app.endpoint));
		setSelectedMenu(currentApp ? currentApp.platform : location.pathname === "/" ? "home" : null);
	}, [apps, location]);

	async function handleOrderChange(layout, oldItem, newItem) {
		const app = apps.find(a => a.platform === oldItem.i);

		await patchApp(app._id, { pos: newItem.y });
	}

	function renderAppList() {
		if (loading) return <Loading />;

		return (
			<Box display="flex" flexDirection="column" height="100%">
				<Box flexGrow={1}>
					<ListItem
						key="home"
						button
						selected={selectedMenu === "home"}
						component={Link}
						className={classes.appItem}
						to="/"
					>
						<Typography>
							<i className="icon-home icon-2x" />
						</Typography>
					</ListItem>
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
						{apps &&
							apps
								.filter(a => a.endpoint)
								.map((app, i) => (
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
												<i className={app.menuIcon} />
											</Typography>
										</ListItem>
									</div>
								))}
					</GridLayout>
				</Box>
				<Actions />
			</Box>
		);
	}

	function renderAddMoreApps() {
		if (!apps || apps.length === allApps.length) return null;

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
