import React from "react";
import { NavLink, Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../store/actions/authActions";

const LoggedInLinks = (props) => {
  const apps = [
    { id:1, name: "Reddit", endpoint:"/reddit" },
    { id:2, name: "Youtube", endpoint:"/youtube" },
    { id:3, name: "Twitch", endpoint:"/twitch" },
    { id:4, name: "TV Series", endpoint:"/tvseries" }
  ];

  const getAppList = () => {
		return apps.map(app => {
			return (
        <li className="sliding-middle-out" key={app.id}><NavLink to={ app.endpoint }>{ app.name }</NavLink></li>
			)
		})
	}

  return (
    <div>
      <ul className="leftLinks">
        {getAppList()}
      </ul>
      <ul className="right">
        <li className="sliding-middle-out"><NavLink to="/" onClick={props.logout}>Logout</NavLink></li>
        <li><NavLink to="/" className="btn btn-floating pink lighten-1">NN</NavLink></li>
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
