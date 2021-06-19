import React, { createContext, useReducer } from "react";
import PropTypes from "prop-types";

import { notificationReducer } from "../reducers/NotificationReducer";

export const NotificationContext = createContext();

const NotificationContextProvider = ({ children }) => {
	const initState = {
		notifications: [],
		total: 0,
		scheduledNotifications: [],
	};

	const [state, dispatch] = useReducer(notificationReducer, initState);

	return <NotificationContext.Provider value={{ state, dispatch }}>{children}</NotificationContext.Provider>;
};

NotificationContextProvider.propTypes = {
	children: PropTypes.object.isRequired,
};

export default NotificationContextProvider;
