import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";

import { formatDate } from "../../utils/utils";

import { getNotifications, patchNotification } from "../../actions/notifications";

class Notifications extends Component {
	componentDidMount() {
		this.getNotifications();
	}

	async getNotifications() {
		const { addNotification } = this.props;

		const response = await getNotifications();

		if (response.data) {
			addNotification(response.data);
		}
	}

	async hideNotification(id) {
		const { deleteNotification } = this.props;

		const response = await patchNotification(id);

		if (response.data) {
			deleteNotification(response.data);
		}
	}

	renderNotificationType(type) {
		switch (type) {
			case "tv":
				return <i className="material-icons">{"tv"}</i>;
			default:
				return <i className="material-icons">{"notifications"}</i>;
		}
	}

	render() {
		const { notifications } = this.props;

		const notificationList = notifications.map(notification => {
			return (
				<ListItem key={notification._id}>
					<ListItemAvatar>
						<Avatar style={{ backgroundColor: "#444" }}>
							{this.renderNotificationType(notification.type)}
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={notification.message}
						secondary={formatDate(notification._created, "DD-MM-YYYY HH:mm")}
					/>
					<ListItemSecondaryAction onClick={() => this.hideNotification(notification._id)}>
						<IconButton edge="end" aria-label="Hide">
							<i className="material-icons">{"check_circle"}</i>
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem >
			);
		});

		return (
			<div>
				<List
					style={{
						backgroundColor: "#222",
						height: "calc( 100vh - 200px )",
						overflow: "auto",
					}}
				>
					{notificationList}
				</List>
			</div>
		);
	}
}

Notifications.propTypes = {
	notifications: PropTypes.array,
	addNotification: PropTypes.func,
	deleteNotification: PropTypes.func,
};

const mapStateToProps = state => {
	return {
		notifications: state.notifications.notifications,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		addNotification: notification => dispatch({ type: "ADD_NOTIFICATION", notification }),
		deleteNotification: notification => dispatch({ type: "DELETE_NOTIFICATION", notification }),
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
