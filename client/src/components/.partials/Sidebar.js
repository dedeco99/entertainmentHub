import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import GridLayout from "react-grid-layout";

import {
	makeStyles,
	List,
	ListSubheader,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Menu,
	MenuItem,
	Badge,
	Collapse,
	Divider,
	Box,
	Button,
} from "@material-ui/core";

import Loading from "./Loading";

import { orderSubscriptionGroups } from "../../api/subscriptions";

import { formatNumber, groupOptionsArray, chooseContext } from "../../utils/utils";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Sidebar({ options, platform, selected, idField, countField, action, menu, loading, noResultsMessage }) {
	const classes = useStyles();
	const { dispatch } = useContext(chooseContext(platform));
	const [anchorEl, setAnchorEl] = useState(null);
	const [groups, setGroups] = useState([]);
	const [expandedLists, setExpandedLists] = useState([]);
	const [firstTime, setFirstTime] = useState(true);
	const [sortMode, setSortMode] = useState(false);

	useEffect(() => {
		const updatedGroups = groupOptionsArray(options).sort((a, b) => (a.pos > b.pos ? 1 : -1));

		setGroups(updatedGroups);

		if (updatedGroups.length && firstTime) {
			setExpandedLists([...Array(updatedGroups.length).keys()]);
			setFirstTime(false);
		}
	}, [options]);

	function handleClick(id) {
		action(id);
	}

	function handleSetAnchorEl(e) {
		setAnchorEl(e.currentTarget);
	}

	function handleClose() {
		setAnchorEl(null);
	}

	function handleExpand(list) {
		if (expandedLists.includes(list)) {
			const index = expandedLists.indexOf(list);
			const updatedLists = expandedLists.slice(0, index).concat(expandedLists.slice(index + 1));

			setExpandedLists(updatedLists);
		} else {
			setExpandedLists([...expandedLists, list]);
		}
	}

	function handleGroupSortMode() {
		setSortMode(!sortMode);
	}

	async function handleOrderChange(layout) {
		layout.sort((a, b) => a.y - b.y);

		const orderedGroups = layout.map(g => g.i);

		const response = await orderSubscriptionGroups(platform, orderedGroups);

		if (response.status === 200) {
			const populatedGroups = [];

			for (const group of response.data) {
				const populatedGroup = groups.find(g => g.name === group.name);
				populatedGroups.push({ ...populatedGroup, pos: group.pos });
			}

			setGroups(populatedGroups);
		}
	}

	if (loading) return <Loading />;

	if (!options || !options.length) return <div className={classes.center}>{noResultsMessage}</div>;

	const optionsList = sortMode ? (
		<List className={classes.listMenu} style={{ overflow: "hidden" }}>
			<GridLayout
				className="layout"
				cols={1}
				rowHeight={55}
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
							<ListSubheader style={{ backgroundColor: "#333", width: "100%" }}>{group.name}</ListSubheader>
						</Box>
					</div>
				))}
			</GridLayout>
		</List>
	) : (
		<List className={classes.listMenu}>
			{groups.map((group, index) => (
				<List
					key={index}
					disablePadding
					subheader={
						<>
							<ListSubheader style={{ backgroundColor: "#333", zIndex: 2 }}>
								{group.name}
								<Badge
									color="secondary"
									max={999}
									badgeContent={group.list.length}
									style={{ position: "absolute", top: "23px", right: "60px" }}
								/>
								<ListItemSecondaryAction onClick={() => handleExpand(index)}>
									<IconButton color="primary" edge="end">
										<i className={expandedLists.includes(index) ? "icon-caret-up" : "icon-caret-down"} />
									</IconButton>
								</ListItemSecondaryAction>
							</ListSubheader>
							{index !== groups.length - 1 && <Divider />}
						</>
					}
				>
					<Collapse in={expandedLists.includes(index)}>
						{group.list.map((option, index) => (
							<ListItem
								button
								selected={selected === option[idField]}
								onClick={() => handleClick(option[idField])}
								key={index}
								style={index === 0 ? { marginTop: "10px" } : null}
							>
								<ListItemAvatar>
									<Badge color="secondary" max={999} badgeContent={option[countField]}>
										<Avatar alt={option.displayName} src={option.image} />
									</Badge>
								</ListItemAvatar>
								<ListItemText
									primary={option.displayName}
									secondary={
										option.viewers && (
											<>
												<Badge variant="dot" color="secondary" style={{ paddingLeft: 5, marginRight: 10 }} />
												{formatNumber(option.viewers)}
											</>
										)
									}
									style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: 150 }}
								/>
								{menu && menu.length ? (
									<ListItemSecondaryAction id={option[idField]} onClick={handleSetAnchorEl}>
										<IconButton color="primary" edge="end">
											<i className="icon-more" />
										</IconButton>
									</ListItemSecondaryAction>
								) : null}
							</ListItem>
						))}
					</Collapse>
				</List>
			))}
			{menu ? (
				<Menu
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
					getContentAnchorEl={null}
					anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
					transformOrigin={{ vertical: "top", horizontal: "right" }}
				>
					{menu.map((option, index) => (
						<MenuItem
							key={index}
							id={anchorEl && anchorEl.id}
							onClick={e => {
								option.onClick(e);
								handleClose();
							}}
						>
							{option.displayName}
						</MenuItem>
					))}
				</Menu>
			) : null}
		</List>
	);

	return (
		<Box style={{ position: "sticky", top: "16px" }}>
			{groups.length > 1 && (
				<Button onClick={handleGroupSortMode} style={{ width: "100%" }}>
					<i className="icon-tabs" />
				</Button>
			)}
			{optionsList}
		</Box>
	);
}

Sidebar.propTypes = {
	options: PropTypes.array.isRequired,
	platform: PropTypes.string.isRequired,
	selected: PropTypes.string,
	idField: PropTypes.string.isRequired,
	action: PropTypes.func.isRequired,
	menu: PropTypes.array,
	loading: PropTypes.bool,
	noResultsMessage: PropTypes.string,
};

export default Sidebar;
