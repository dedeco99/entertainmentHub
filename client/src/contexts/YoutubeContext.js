import React, { createContext, useReducer } from "react";
import PropTypes from "prop-types";

import { youtubeReducer } from "../reducers/YoutubeReducer";

export const YoutubeContext = createContext();

const YoutubeContextProvider = ({ children }) => {
	const initState = {
		subscriptions: [],
		channels: [],
		channelGroups: [],
	};

	const [state, dispatch] = useReducer(youtubeReducer, initState);

	return (
		<YoutubeContext.Provider value={{ state, dispatch }}>
			{children}
		</YoutubeContext.Provider>
	);
};

YoutubeContextProvider.propTypes = {
	children: PropTypes.object.isRequired,
};

export default YoutubeContextProvider;
