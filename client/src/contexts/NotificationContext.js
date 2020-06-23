import React, { createContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";

import { notificationReducer } from "../reducers/NotificationReducer";

export const NotificationContext = createContext();

const NotificationContextProvider = ({ children }) => {
	const initState = {
		notifications: [],
		total: 0,
	};

	const [notifications, dispatch] = useReducer(notificationReducer, initState, () => {
		const localData = localStorage.getItem("notifications");
		return localData ? JSON.parse(localData) : initState;
	});

	useEffect(() => {
		localStorage.setItem("notifications", JSON.stringify(notifications));
	}, [notifications]);

	return (
		<NotificationContext.Provider value={{ notificationState: notifications, dispatch }}>
			{children}
		</NotificationContext.Provider>
	);
};

NotificationContextProvider.propTypes = {
	children: PropTypes.object.isRequired,
};

export default NotificationContextProvider;
