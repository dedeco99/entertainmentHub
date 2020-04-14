import React from "react";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import LoggedInLinks from "./LoggedInLinks";
import LoggedOutLinks from "./LoggedOutLinks";

import logo from "../../img/logo.png";

const styles = () => ({
	appBar: {
		backgroundColor: "#222",
		marginBottom: 20,
	},
	title: {
		flexGrow: 1,
		marginLeft: 50,
	},
});

function Header({ classes }) {
	const user = localStorage.getItem("user");
	const token = localStorage.getItem("token");

	const links = user && token ? <LoggedInLinks /> : <LoggedOutLinks />;

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
