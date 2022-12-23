import React, { createContext, useReducer } from "react";
import PropTypes from "prop-types";

import { tvReducer } from "../reducers/TVReducer";

export const TVContext = createContext();

const TVContextProvider = ({ children }) => {
	const initState = {
		series: {},
		subscriptions: [],
		groups: [],
	};

	const [state, dispatch] = useReducer(tvReducer, initState);

	return <TVContext.Provider value={{ state, dispatch }}>{children}</TVContext.Provider>;
};

TVContextProvider.propTypes = {
	children: PropTypes.object.isRequired,
};

export default TVContextProvider;
