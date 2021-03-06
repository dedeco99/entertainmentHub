import React, { createContext, useReducer } from "react";
import PropTypes from "prop-types";

import { userReducer } from "../reducers/UserReducer";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
	const [user, dispatch] = useReducer(userReducer, {}, () => {
		const localData = localStorage.getItem("user");
		return localData ? JSON.parse(localData) : {};
	});

	return <UserContext.Provider value={{ user, dispatch }}>{children}</UserContext.Provider>;
};

UserContextProvider.propTypes = {
	children: PropTypes.object.isRequired,
};

export default UserContextProvider;
