import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import IconButton from "@material-ui/core/IconButton";
import Grow from "@material-ui/core/Grow";
import Badge from "@material-ui/core/Badge";

import { NotificationContext } from "../../contexts/NotificationContext";

import Notifications from "../widgets/Notifications";

import { notificationDropdown as styles } from "../../styles/Header";

class NotificationDropdown extends Component {
	constructor() {
		super();

		this.state = {
			open: false,
		};

		this.handleClick = this.handleClick.bind(this);
		this.handleClickAway = this.handleClickAway.bind(this);
	}

	handleClick() {
		const { open } = this.state;

		this.setState({ open: !open });
	}

	handleClickAway(e) {
		if (!e.target.id.includes("filter-")) {
			this.setState({ open: false });
		}
	}

	renderDropdownContent() {
		const { classes } = this.props;
		const { open } = this.state;

		return (
			<Grow in={open} style={{ transformOrigin: "right top" }}>
				<Paper variant="outlined" className={classes.paper}>
					<Notifications height={"50vh"} />
				</Paper>
			</Grow>
		);
	}

	render() {
		const { notificationState } = this.context;
		const { total } = notificationState;
		const { classes } = this.props;

		return (
			<ClickAwayListener onClickAway={this.handleClickAway}>
				<div className={classes.wrapper}>
					<Badge badgeContent={total} max={999} overlap="circle" color="error">
						<IconButton color="primary" onClick={this.handleClick}>
							<i className="icofont-alarm" />
						</IconButton>
					</Badge>
					{this.renderDropdownContent()}
				</div>
			</ClickAwayListener>
		);
	}
}

NotificationDropdown.contextType = NotificationContext;

NotificationDropdown.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotificationDropdown);
