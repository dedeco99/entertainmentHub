import React, { createContext, useReducer } from "react";
import PropTypes from "prop-types";

import { twitchReducer } from "../reducers/TwitchReducer";

export const TwitchContext = createContext();

const TwitchContextProvider = ({ children }) => {
	const initState = {
		subscriptions: [],
		channels: [],
	};

	const [state, dispatch] = useReducer(twitchReducer, initState);

	return (
		<TwitchContext.Provider value={{ state, dispatch }}>
			{children}
		</TwitchContext.Provider>
	);
};

TwitchContextProvider.propTypes = {
	children: PropTypes.object.isRequired,
};

export default TwitchContextProvider;
