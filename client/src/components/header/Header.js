import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";

import LoggedInLinks from "./LoggedInLinks";
import LoggedOutLinks from "./LoggedOutLinks";

import "../../css/Header.css";
import logo from "../../img/logo.png";

const Header = (props) => {
  const { auth } = props;
  const links = auth.uid ? <LoggedInLinks /> : <LoggedOutLinks /> ;

  return (
    <nav className="nav-wrapper grey darken-3">
      <div className="full-width">
        <Link to="/" className="brand-logo"><img src={logo} id="logo" width="80px" alt="Logo"/></Link>
        { links }
      </div>
    </nav>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}

export default connect(mapStateToProps)(Header);
