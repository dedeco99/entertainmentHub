import React, { createContext, useReducer } from "react";
import PropTypes from "prop-types";

import { actionReducer } from "../reducers/ActionReducer";

export const ActionContext = createContext();

const ActionContextProvider = ({ children }) => {
	const initState = {
		actions: [],
	};

	const [state, dispatch] = useReducer(actionReducer, initState);

	return <ActionContext.Provider value={{ state, dispatch }}>{children}</ActionContext.Provider>;
};

ActionContextProvider.propTypes = {
	children: PropTypes.object.isRequired,
};

export default ActionContextProvider;
