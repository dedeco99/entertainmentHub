import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext";

function PrivateRoute({ component: Component, ...rest }) {
	const { user } = useContext(UserContext);

	function render(props) {
		const { location } = props;

		if (user && user.token) {
			return <Component {...props} />;
		}

		return <Redirect to={{ pathname: "/login", state: { from: location } }} />;
	}

	return <Route {...rest} render={render} />;
}

PrivateRoute.propTypes = {
	component: PropTypes.elementType.isRequired,
	location: PropTypes.object,
};

export default PrivateRoute;
