import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext";

function PrivateRoute({ component: Component, ...rest }) {
	const { user } = useContext(UserContext);

	return (
		<Route
			{...rest}
			// eslint-disable-next-line react/jsx-no-bind
			render={props => {
				if (user && user.token) {
					return <Component {...props} />;
				}

				return <Redirect to={{ pathname: "/login", state: { from: props.location } }} />;
			}}
		/>
	);
}

PrivateRoute.propTypes = {
	component: PropTypes.elementType.isRequired,
	location: PropTypes.object,
};

export default PrivateRoute;
