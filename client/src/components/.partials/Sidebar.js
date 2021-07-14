import React, { useState } from "react";
import PropTypes from "prop-types";

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
} from "@material-ui/core";

import Loading from "./Loading";

import { formatNumber, groupOptions } from "../../utils/utils";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Sidebar({ options, selected, idField, countField, action, menu, loading, noResultsMessage }) {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState(null);

	function handleClick(id) {
		action(id);
	}

	function handleSetAnchorEl(e) {
		setAnchorEl(e.currentTarget);
	}

	function handleClose() {
		setAnchorEl(null);
	}

	if (loading) return <Loading />;

	if (!options || !options.length) return <div className={classes.center}>{noResultsMessage}</div>;

	const groups = groupOptions(options, "group.name");

	return (
		<List className={classes.listMenu}>
			{Object.keys(groups).map(group => (
				<List
					subheader={
						<ListSubheader style={{ backgroundColor: "#333", zIndex: 2, marginBottom: "8px" }}>
							{group === "null" ? "Ungrouped" : group}
						</ListSubheader>
					}
				>
					{groups[group].map(option => (
						<ListItem
							button
							selected={selected === option[idField]}
							onClick={() => {
								option.viewers ? handleClick(option) : handleClick(option[idField]);
							}}
							key={option[idField]}
							id={option[idField]}
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
							key={option.displayName}
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
}

Sidebar.propTypes = {
	options: PropTypes.array.isRequired,
	selected: PropTypes.string,
	idField: PropTypes.string.isRequired,
	action: PropTypes.func.isRequired,
	menu: PropTypes.array,
	loading: PropTypes.bool,
	noResultsMessage: PropTypes.string,
};

export default Sidebar;
