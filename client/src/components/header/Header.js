import React, { useContext, useState } from "react";
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
	const [hovered, setHovered] = useState(false);

	function handleHovered() {
		setHovered(true);
	}

	function handleNotHovered() {
		setHovered(false);
	}

	const links = user && user.token ? <LoggedInLinks /> : <LoggedOutLinks />;

	if (user && user.token) {
		return (
			<div>
				<AppMenu />
				<AppBar
					className={classes.appBar}
					style={hovered ? { zIndex: 1 } : {}}
					onMouseEnter={handleHovered}
					onMouseLeave={handleNotHovered}
				>
					<Toolbar>
						<div className={classes.brand}>
							<Link to="/">
								<img src={logo} id="logo" width="100px" alt="Logo" />
							</Link>
						</div>
						{links}
					</Toolbar>
				</AppBar>
			</div>
		);
	}

	return null;
}

export default Header;
