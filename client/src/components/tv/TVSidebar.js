import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import GridLayout from "react-grid-layout";

import {
	makeStyles,
	List,
	ListItem,
	Box,
	Button,
	Typography,
	Badge,
	ListItemSecondaryAction,
	TextField,
} from "@material-ui/core";

import Loading from "../.partials/Loading";

import { getSubscriptions, patchSubscription } from "../../api/subscriptions";

import { groupOptionsArray, chooseContext } from "../../utils/utils";
import { SubscriptionContext } from "../../contexts/SubscriptionContext";
import { translate } from "../../utils/translations";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function TVSidebar({ currentGroup, onGroupClick, onSearch }) {
	const classes = useStyles();
	const { dispatch: subscriptionDispatch } = useContext(SubscriptionContext);
	const { state, dispatch } = useContext(chooseContext("tv"));
	const { subscriptions } = state;
	const [groups, setGroups] = useState([]);
	const [sortMode, setSortMode] = useState(false);
	const [firstTime, setFirstTime] = useState(true);
	const [loading, setLoading] = useState(false);
	const searchRef = useRef(null);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			setLoading(true);

			const response = await getSubscriptions("tv");

			if (response.status === 200 && isMounted) {
				dispatch({ type: "SET_SUBSCRIPTIONS", subscriptions: response.data });

				setLoading(false);
			}
		}

		fetchData();

		return () => (isMounted = false);
	}, []);

	useEffect(() => {
		const uniqueGroups = [];

		for (const subscription of subscriptions) {
			subscription.group = subscription.group ? subscription.group : { name: "Ungrouped", pos: 0 };

			if (!uniqueGroups.find(group => group.name === subscription.group.name)) {
				uniqueGroups.push(subscription.group);
			}
		}

		subscriptionDispatch({ type: "SET_GROUPS", groups: uniqueGroups });

		const updatedGroups = groupOptionsArray(subscriptions).sort((a, b) => (a.pos > b.pos ? 1 : -1));

		setGroups(updatedGroups);

		if (updatedGroups.length && firstTime) {
			setFirstTime(false);
		}
	}, [subscriptions]);

	function handleGroupSortMode() {
		setSortMode(!sortMode);
	}

	async function handleOrderChange(layout, oldItem, newItem) {
		const group = groups[oldItem.y];

		const response = await patchSubscription(group.list[0]._id, { group: { name: group.name, pos: newItem.y } });

		if (response.status === 200) {
			dispatch({ type: "SET_SUBSCRIPTIONS", subscriptions: response.data });
		}
	}

	function handleSearch(e) {
		e.preventDefault();
		onSearch(searchRef.current.value);
	}

	if (loading) return <Loading />;

	if (!subscriptions || !subscriptions.length) return <div className={classes.center}>{"No groups"}</div>;

	return (
		<Box p={3} style={{ position: "sticky", top: "16px", backgroundColor: "#222" }}>
			<form onSubmit={handleSearch}>
				<TextField
					id="search"
					placeholder={translate("search")}
					size="small"
					variant="outlined"
					inputRef={searchRef}
					style={{ backgroundColor: "#464646" }}
					fullWidth
				/>
			</form>
			<Box display="flex" py={2}>
				<Typography variant="body1" style={{ flex: 1 }}>
					{"Lists"}
				</Typography>
				{groups.length > 1 ? (
					<Button onClick={handleGroupSortMode}>
						<i className="icon-tabs" />
					</Button>
				) : null}
			</Box>
			{sortMode ? (
				<List className={classes.listMenu} style={{ overflow: "hidden" }}>
					<ListItem> {translate("all")} </ListItem>
					<GridLayout
						className="layout"
						cols={1}
						rowHeight={36}
						width={500}
						margin={[0, 0]}
						isResizable={false}
						onDragStart={(layout, oldItem, newItem, placeholder, e) => {
							e.stopPropagation();
						}}
						onDragStop={handleOrderChange}
						draggableHandle=".handleListItem"
					>
						{groups.map(group => (
							<div key={group.name} data-grid={{ x: 0, y: group.pos, w: 1, h: 1 }}>
								<Box display="flex" height="100%" width="100%" position="relative" border="1px solid #222">
									<Box
										display="flex"
										className="handleListItem"
										width="55px"
										height="100%"
										alignItems="center"
										justifyContent="center"
										style={{ cursor: "grab" }}
									>
										<i className="icon-drag-handle" />
									</Box>
									<ListItem>{group.name}</ListItem>
								</Box>
							</div>
						))}
					</GridLayout>
				</List>
			) : (
				<List disablePadding className={classes.listMenu}>
					<ListItem selected={currentGroup === "all"} button onClick={() => onGroupClick("all")}>
						{translate("all")}
						<ListItemSecondaryAction>
							<Badge
								color="secondary"
								max={999}
								badgeContent={groups.map(group => group.list.length).reduce((prev, next) => prev + next, 0)}
							/>
						</ListItemSecondaryAction>
					</ListItem>

					{groups.map(group => (
						<ListItem
							selected={group.name === currentGroup}
							button
							onClick={() => onGroupClick(group.name)}
							key={group.name}
						>
							{group.name}
							<ListItemSecondaryAction>
								<Badge color="secondary" max={999} badgeContent={group.list.length} />
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</List>
			)}
		</Box>
	);
}

TVSidebar.propTypes = {
	currentGroup: PropTypes.string,
	onGroupClick: PropTypes.func.isRequired,
	onSearch: PropTypes.func.isRequired,
};

export default TVSidebar;