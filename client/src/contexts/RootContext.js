import React from "react";
import PropTypes from "prop-types";

import NotificationContextProvider from "./NotificationContext";

const RootContext = ({ children }) => (
	<NotificationContextProvider>
		{children}
	</NotificationContextProvider>
);

RootContext.propTypes = {
	children: PropTypes.object.isRequired,
};

export default RootContext;
