import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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

	render() {
		const { notifications } = this.props;

		const notificationList = notifications.map(notification => {
			return (
				<div key={notification}>
					{`${notification.type} - ${notification.message}`}
					<br />
				</div>
			);
		});

		return (
			<div className="Index">
				<h1>{"Notifications"}</h1>
				<br />
				{notificationList}
			</div>
		);
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
