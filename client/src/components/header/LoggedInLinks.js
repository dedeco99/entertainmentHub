import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../store/actions/authActions";

const LoggedInLinks = (props) => {
  return (
    <div className="navbar-collapse collapse" id="appNavbar">
      <ul className="navbar-nav mr-auto"></ul>
      <ul className="navbar-nav navbar-right">
        <li className="nav-item">
          <NavLink to="/settings"><i className="icofont-ui-user"></i></NavLink>
        </li>
        <li className="nav-item sliding-middle-out">
          <NavLink to="/logout" onClick={ props.logout }>Logout</NavLink>
        </li>
      </ul>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout())
  }
}

export default connect(null, mapDispatchToProps)(LoggedInLinks)
