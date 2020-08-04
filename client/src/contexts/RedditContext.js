import React, { createContext, useReducer } from "react";
import PropTypes from "prop-types";

import { redditReducer } from "../reducers/RedditReducer";

export const RedditContext = createContext();

const RedditContextProvider = ({ children }) => {
	const initState = {
		follows: [],
		subscriptions: [],
		feeds: [],
	};

	const [state, dispatch] = useReducer(redditReducer, initState);

	return <RedditContext.Provider value={{ state, dispatch }}>{children}</RedditContext.Provider>;
};

RedditContextProvider.propTypes = {
	children: PropTypes.object.isRequired,
};

export default RedditContextProvider;
