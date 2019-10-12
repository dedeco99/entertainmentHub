import React from "react";
import { Link } from "react-router-dom";

import LoggedInLinks from "./LoggedInLinks";
import LoggedOutLinks from "./LoggedOutLinks";
import AppMenu from "./AppMenu";

import "../../css/Header.css";
import logo from "../../img/logo.png";

const Header = () => {
	const user = localStorage.getItem("user");
	const token = localStorage.getItem("token");

	const links = user && token ? <LoggedInLinks /> : <LoggedOutLinks />;
	const appMenu = user && token ? <AppMenu /> : null;

	return (
		<div className="header">
			<nav className="navbar navbar-expand fixed-top navbar-dark dark">
				<Link to="/" className="navbar-brand">
					<img src={logo} id="logo" width="60px" alt="Logo" />
					<span className="navbar-brand-text">EntertainmentHub</span>
				</Link>
				{links}
			</nav>
			{appMenu}
		</div>
	);
}

export default Header;
