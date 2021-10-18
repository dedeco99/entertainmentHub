import React, { createContext, useReducer } from "react";
import PropTypes from "prop-types";

import { subscriptionReducer } from "../reducers/SubscriptionReducer";

export const SubscriptionContext = createContext();

const SubscriptionContextProvider = ({ children }) => {
	const initState = {
		open: false,
		isNotification: false,
		subscription: null,
		groups: null,
	};

	const [subscriptions, dispatch] = useReducer(subscriptionReducer, initState);

	return (
		<SubscriptionContext.Provider value={{ state: subscriptions, dispatch }}>
			{children}
		</SubscriptionContext.Provider>
	);
};

SubscriptionContextProvider.propTypes = {
	children: PropTypes.object.isRequired,
};

export default SubscriptionContextProvider;
