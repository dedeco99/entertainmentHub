import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";

import { formatDate } from "../../utils/utils";

import { getNotifications, patchNotifications, deleteNotifications } from "../../actions/notifications";

class Notifications extends Component {
	constructor() {
		super();
		this.state = {
			history: false,
		};

		this.toggleHistory = this.toggleHistory.bind(this);
	}

	componentDidMount() {
		this.getNotifications();
	}

	async getNotifications(history) {
		const { addNotification } = this.props;

		const response = await getNotifications(history);

		if (response.data) {
			addNotification(response.data);
		}
	}

	async hideNotification(id) {
		const { deleteNotification } = this.props;
		const { history } = this.state;

		const response = history ? await deleteNotifications(id) : await patchNotifications(id);

		if (response.data) {
			deleteNotification(response.data);
		}
	}

	async toggleHistory() {
		const { history } = this.state;

		await this.getNotifications(!history);

		this.setState({ history: !history });
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
		const { history } = this.state;

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
					<ListItemSecondaryAction
						onClick={() => this.hideNotification(notification._id)}
					>
						<IconButton edge="end">
							<i className="material-icons">{history ? "delete" : "check_circle"}</i>
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
					<ListSubheader
						style={{ top: "-8px", paddingTop: "5px", height: "35px" }}
						onClick={this.toggleHistory}
					>
						<i
							className="material-icons"
							style={{ top: "10px", float: "right" }}
						>
							{history ? "notifications" : "history"}
						</i>
					</ListSubheader>
					{notificationList}
				</List>
			</div >
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
