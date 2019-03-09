import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import LoggedInLinks from "./LoggedInLinks";
import LoggedOutLinks from "./LoggedOutLinks";
import AppMenu from "./AppMenu";

import "../../css/Header.css";
import logo from "../../img/logo.png";

const Header = (props) => {
  const { auth } = props;
  const links = auth.uid ? <LoggedInLinks /> : <LoggedOutLinks />;
  const appMenu = auth.uid ? <AppMenu /> : null;

  return (
    <div className="header">
      <nav className="navbar navbar-expand fixed-top navbar-dark dark">
        <Link to="/" className="navbar-brand">
          <img src={ logo } id="logo" width="60px" alt="Logo"/>
          <span className="navbar-brand-text">EntertainmentHub</span>
        </Link>
  			{ links }
  		</nav>
      { appMenu }
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}

export default connect(mapStateToProps)(Header);
