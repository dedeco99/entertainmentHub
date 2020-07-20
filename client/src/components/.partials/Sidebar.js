import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";

import { StyledMenu, StyledMenuItem } from "../.partials/Menu";

import loadingGif from "../../img/loading2.gif";

import styles from "../../styles/General";

class Sidebar extends Component {
	constructor() {
		super();
		this.state = {
			selectedMenu: null,
			anchorEl: null,
			currentId: null,
		};

		this.handleClick = this.handleClick.bind(this);
		this.setAnchorEl = this.setAnchorEl.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	handleClick(id) {
		this.props.action(id);

		this.setState({ selectedMenu: id });
	}

	setAnchorEl(e) {
		this.setState({ anchorEl: e.currentTarget, currentId: e.currentTarget.id });
	}

	handleClose() {
		this.setState({ anchorEl: null });
	}

	renderLoading() {
		const { classes, loading, noResultsMessage } = this.props;

		if (loading) {
			return (
				<div className={classes.loading} align="center">
					<img className={classes.loadingImg}  src={loadingGif} alt="Loading..." />
				</div>
			);
		} else {
			return (
				<div className={classes.center}>{noResultsMessage}</div>
			)
		}
	}

	render() {
		const { classes, options, idField, menu, initialSelected } = this.props;
		const { selectedMenu, anchorEl, currentId } = this.state;

		let optionsList = this.renderLoading();
		if (options && options.length) {
			optionsList = options.map(option => {
				return (
					<ListItem
						button
						selected={(selectedMenu || initialSelected) === option[idField]}
						onClick={() => this.handleClick(option[idField])}
						key={option[idField]}
						id={option[idField]}
					>
						<ListItemText primary={option.displayName} />
						{menu && menu.length ?
							<ListItemSecondaryAction id={option[idField]} onClick={this.setAnchorEl}>
								<IconButton color="primary" edge="end">
									<i className="material-icons">{"more_vert"}</i>
								</IconButton>
							</ListItemSecondaryAction> : null}
					</ListItem>
				);
			});
		}

		return (
			<List className={classes.listMenu}>
				{optionsList}
				{menu ?
					<StyledMenu
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={this.handleClose}
					>
						{
							menu.map(option => (
								<StyledMenuItem
									id={currentId}
									key={option.displayName}
									onClick={e => { option.onClick(e); this.handleClose(); }}
								>
									{option.displayName}
								</StyledMenuItem>
							))
						}
					</StyledMenu> : null}
			</List>
		);
	}
}

Sidebar.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Sidebar);
