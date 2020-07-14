import React, { useContext } from "react";
import { Link } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { UserContext } from "../../contexts/UserContext";

import AppMenu from "./AppMenu";
import LoggedInLinks from "./LoggedInLinks";
import LoggedOutLinks from "./LoggedOutLinks";

import logo from "../../img/logo.png";

import { header as useStyles } from "../../styles/Header";

function Header() {
	const classes = useStyles();
	const { user } = useContext(UserContext);

	const links = user && user.token ? <LoggedInLinks /> : <LoggedOutLinks />;

	return (
		<div>
			{user && user.token && <AppMenu />}
			<AppBar className={classes.appBar}>
				<Toolbar>
					<Link to="/" className={classes.brand}>
						<img src={logo} id="logo" width="60px" alt="Logo" />
					</Link>
					<Typography variant="h6" className={classes.title}>
						{"EntertainmentHub"}
					</Typography>
					{links}
				</Toolbar>
			</AppBar>
		</div>
	);
}

export default Header;
