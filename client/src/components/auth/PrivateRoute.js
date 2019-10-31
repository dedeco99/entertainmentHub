import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
	const user = localStorage.getItem("user");
	const token = localStorage.getItem("token");

	const handleRender = props => {
		if (user && token) {
			return <Component {...props} />;
		}

		return <Redirect to={{ pathname: "/login", state: { from: props.location } }} />;
	};

	return (
		<Route
			{...rest}
			render={handleRender}
		/>
	);
}

PrivateRoute.propTypes = {
	component: PropTypes.elementType,
	location: PropTypes.object,
};

export default PrivateRoute;
