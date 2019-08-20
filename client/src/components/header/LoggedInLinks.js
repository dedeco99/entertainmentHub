import React from "react";
import { NavLink } from "react-router-dom";

import { logout } from "../../actions/auth";

const LoggedInLinks = () => {
	return (
		<div className="navbar-collapse collapse" id="appNavbar">
			<ul className="navbar-nav mr-auto"></ul>
			<ul className="navbar-nav navbar-right">
				<li className="nav-item">
					<NavLink to="/settings"><i className="icofont-ui-user"></i></NavLink>
				</li>
				<li className="nav-item sliding-middle-out">
					<NavLink to="/logout" onClick={logout}>Logout</NavLink>
				</li>
			</ul>
		</div>
	)
}

export default LoggedInLinks;
