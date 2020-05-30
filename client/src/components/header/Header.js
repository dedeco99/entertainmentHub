import React, { useContext } from "react";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { UserContext } from "../../contexts/UserContext";

import LoggedInLinks from "./LoggedInLinks";
import LoggedOutLinks from "./LoggedOutLinks";

import logo from "../../img/logo.png";

import { header as styles } from "../../styles/Header";

function Header({ classes }) {
	const { user } = useContext(UserContext);

	const links = user && user.token ? <LoggedInLinks /> : <LoggedOutLinks />;

	return (
		<AppBar position="sticky" className={classes.appBar}>
			<Toolbar>
				<Link to="/" className="navbar-brand">
					<img src={logo} id="logo" width="60px" alt="Logo" />
				</Link>
				<Typography variant="h6" className={classes.title}>
					{"EntertainmentHub"}
				</Typography>
				{links}
			</Toolbar>
		</AppBar>
	);
}

Header.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
