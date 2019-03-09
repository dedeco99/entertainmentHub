import React from "react";
import { NavLink } from "react-router-dom";

const LoggedOutLinks = () => {
  return (
    <div className="navbar-collapse collapse" id="appNavbar">
      <ul className="navbar-nav mr-auto"></ul>
      <ul className="navbar-nav navbar-right">
        <li className="nav-item sliding-middle-out"><NavLink to="/register">Register</NavLink></li>
        <li className="nav-item sliding-middle-out"><NavLink to="/login">Login</NavLink></li>
      </ul>
    </div>
  )
}

export default LoggedOutLinks
