import React, { createContext, useReducer } from "react";
import PropTypes from "prop-types";

import { widgetReducer } from "../reducers/WidgetReducer";

export const WidgetContext = createContext();

const WidgetContextProvider = ({ children }) => {
	const initState = {
		widgets: [],
		editMode: false,
	};

	const [widgets, dispatch] = useReducer(widgetReducer, initState);

	return <WidgetContext.Provider value={{ state: widgets, dispatch }}>{children}</WidgetContext.Provider>;
};

WidgetContextProvider.propTypes = {
	children: PropTypes.object.isRequired,
};

export default WidgetContextProvider;
