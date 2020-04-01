import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

import { formatDate } from "../utils/utils";

import { getNotifications } from "../actions/notifications";

class Index extends Component {
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

	renderNotificationType(type) {
		switch (type) {
			case "tv":
				return <i className="material-icons">{"tv"}</i>;
			default:
				return <i className="material-icons">{"notifications"}</i>;
		}
	}

	renderDashboard() {
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
				</ListItem >
			);
		});

		return (
			<div className="Index" >
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
						<h1 style={{ textAlign: "center" }}>{"Notifications"}</h1>
						<List
							style={{
								backgroundColor: "#222",
								height: "calc( 100vh - 200px )",
								overflow: "auto",
							}}
						>
							{notificationList}
						</List>
					</Grid>
				</Grid>
			</div>
		);
	}

	renderIndex() {
		return (
			<div>
				{"Login to see the good stuff"}
			</div>
		);
	}

	render() {
		const user = localStorage.getItem("user");
		const token = localStorage.getItem("token");

		if (user && token) return this.renderDashboard();

		return this.renderIndex();
	}
}

Index.propTypes = {
	notifications: PropTypes.array,
	addNotification: PropTypes.func,
};

const mapStateToProps = state => {
	return {
		notifications: state.notifications.notifications,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		addNotification: notification => dispatch({ type: "ADD_NOTIFICATION", notification }),
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(Index);
