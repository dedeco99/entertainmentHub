import React, { Component } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import ListSubheader from "@material-ui/core/ListSubheader";

import { connect } from "react-redux";

const styles = {
	wrapper: {
		display: "inline-block",
		position: "relative",
	},
	paper: {
		position: "absolute",
		width: 250,
		right: 0,
		backgroundColor: "#212121",
	},
	list: {
		paddingBottom: 0,
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
		this.getNotifications = this.getNotifications.bind(this);
		this.renderNotificationType = this.renderNotificationType.bind(this);
	}

	handleClick() {
		const { open } = this.state;
		this.setState({ open: !open });
	}

	handleClickAway() {
		this.setState({ open: false });
	}

	renderNotificationType(type) {
		switch (type) {
			case "tv":
				return <i className="material-icons">{"tv"}</i>;
			default:
				return <i className="material-icons">{"notifications"}</i>;
		}
	}

	getNotifications() {
		const { notifications } = this.props;

		const notificationList = notifications.map(notification => {
			return (
				<ListItem key={notification._id} button divider>
					<ListItemAvatar>
						<Avatar style={{ backgroundColor: "#444" }}>
							{this.renderNotificationType(notification.type)}
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={notification.message}
						secondary={notification._created}
						primaryTypographyProps={{ noWrap: true }}
					/>
				</ListItem>
			);
		});

		return notificationList;
	}

	render() {
		const { classes } = this.props;
		const { open } = this.state;

		return (
			<ClickAwayListener onClickAway={this.handleClickAway}>
				<div className={classes.wrapper}>
					<IconButton onClick={this.handleClick}>
						<i className="icofont-alarm" />
					</IconButton>
					{open
						? <Paper variant="outlined" className={classes.paper}>
							<List
								component="nav"
								aria-labelledby="nested-list-subheader"
								subheader={
									<ListSubheader component="div" id="nested-list-subheader">
										{"Notifications"}
									</ListSubheader>
								}
								className={classes.list}
							>
								<Divider />
								{this.getNotifications()}
								<Button size="small" fullWidth style={{ borderRadius: 0 }}>{"See All"}</Button>
							</List>
						</Paper>
						: null}
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
