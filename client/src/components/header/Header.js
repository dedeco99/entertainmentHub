import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { makeStyles, AppBar, Toolbar } from "@material-ui/core";

import { UserContext } from "../../contexts/UserContext";

import AppMenu from "./AppMenu";
import LoggedInLinks from "./LoggedInLinks";
import LoggedOutLinks from "./LoggedOutLinks";

import logo from "../../img/logo.png";

import { header as styles } from "../../styles/Header";

const useStyles = makeStyles(styles);

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
						<img src={logo} id="logo" width="100px" alt="Logo" />
					</Link>
					{links}
				</Toolbar>
			</AppBar>
		</div>
	);
}

export default Header;
