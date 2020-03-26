import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

function Index(props) {
	const { notifications } = props;

	const notificationList = notifications.map(notification => {
		return (
			<div key={notification}>
				{notification}
				<br />
			</div>
		);
	});

	return (
		<div className="Index">
			{"Dashboard yes"}
			<br />
			{notificationList}
		</div>
	);
}

Index.propTypes = {
	notifications: PropTypes.array,
};

const mapStateToProps = state => {
	return {
		notifications: state.notifications.notifications,
	};
};

export default connect(mapStateToProps)(Index);
