import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import LoggedInLinks from "./LoggedInLinks";
import LoggedOutLinks from "./LoggedOutLinks";
import AppMenu from "./AppMenu";

import "../../css/Header.css";
import logo from "../../img/logo.png";

function Header() {
	const user = localStorage.getItem("user");
	const token = localStorage.getItem("token");

	const links = user && token ? <LoggedInLinks /> : <LoggedOutLinks />;
	const appMenu = user && token ? <AppMenu /> : null;

	return (
		<div>
			<AppBar position="static" style={{ backgroundColor: "#222", marginBottom: 20 }}>
				<Toolbar>
					<Link to="/" className="navbar-brand">
						<img src={logo} id="logo" width="60px" alt="Logo" />
					</Link>
					<Typography variant="h6" style={{ flexGrow: 1, marginLeft: 50 }}>
						EntertainmentHub
					</Typography>
					{links}
				</Toolbar>
			</AppBar>
			{appMenu}
		</div>
	);
}

export default Header;
