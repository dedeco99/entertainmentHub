import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";

import { StyledMenu, StyledMenuItem } from "../.partials/Menu";

import loading from "../../img/loading2.gif";

class Sidebar extends Component {
	constructor() {
		super();
		this.state = {
			selectedMenu: 0,
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

	render() {
		const { options, idField, menu } = this.props;
		const { selectedMenu, anchorEl, currentId } = this.state;

		let optionsList = <div className="loading" align="center"><img src={loading} alt="Loading..." /></div>;
		if (options && options.length > 0) {
			optionsList = options.map(option => {
				return (
					<ListItem
						button
						selected={selectedMenu === option[idField]}
						onClick={() => this.handleClick(option[idField])}
						key={option[idField]}
						id={option[idField]}
					>
						<ListItemText primary={option.displayName} />
						{menu && menu.length ?
							<ListItemSecondaryAction id={option[idField]} onClick={this.setAnchorEl}>
								<IconButton edge="end">
									<i className="material-icons">{"more_vert"}</i>
								</IconButton>
							</ListItemSecondaryAction> : null}
					</ListItem>
				);
			});
		}

		return (
			<List className="list-menu" >
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
									onClick={option.onClick}
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

export default Sidebar;
