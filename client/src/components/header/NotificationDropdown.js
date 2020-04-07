import React, { Component } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import IconButton from "@material-ui/core/IconButton";
import Grow from "@material-ui/core/Grow";
import Badge from "@material-ui/core/Badge";

import Notifications from "../index/Notifications";
import { connect } from "react-redux";

const styles = {
	wrapper: {
		display: "inline-block",
		position: "relative",
	},
	paper: {
		position: "absolute",
		width: 280,
		right: 0,
		backgroundColor: "#212121",
	},
};

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

	handleClickAway() {
		this.setState({ open: false });
	}

	renderDropdownContent() {
		const { open } = this.state;
		const { classes } = this.props;

		if (open) {
			return (
				<Grow in={open} style={{ transformOrigin: "right top" }}>
					<Paper variant="outlined" className={classes.paper}>
						<Notifications />
					</Paper>
				</Grow>
			);
		}
		return null;
	}

	render() {
		const { classes, notifications } = this.props;

		return (
			<ClickAwayListener onClickAway={this.handleClickAway}>
				<div className={classes.wrapper}>
					<Badge badgeContent={notifications.length} overlap="circle" color="error">
						<IconButton onClick={this.handleClick}>
							<i className="icofont-alarm" />
						</IconButton>
					</Badge>
					{this.renderDropdownContent()}
				</div>
			</ClickAwayListener>
		);
	}
}

NotificationDropdown.propTypes = {
	notifications: PropTypes.array,
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
	return {
		notifications: state.notifications.notifications,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(NotificationDropdown));
