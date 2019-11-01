import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
	const user = localStorage.getItem("user");
	const token = localStorage.getItem("token");

	return (
		<Route
			{...rest}
			// eslint-disable-next-line react/jsx-no-bind
			render={props => {
				if (user && token) {
					return <Component {...props} />;
				}

				return <Redirect to={{ pathname: "/login", state: { from: props.location } }} />;
			}}
		/>
	);
}

PrivateRoute.propTypes = {
	component: PropTypes.elementType,
	location: PropTypes.object,
};

export default PrivateRoute;
