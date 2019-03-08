import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

import LoggedInLinks from "./LoggedInLinks";
import LoggedOutLinks from "./LoggedOutLinks";

import '../../css/Header.css';
import logo from '../../img/logo.png';

class Header extends Component {
  state = {
    apps: [
      { id:1, name: "Reddit", endpoint:"/reddit" },
      { id:2, name: "Youtube", endpoint:"/youtube" },
      { id:3, name: "Twitch", endpoint:"/twitch" },
      { id:4, name: "TV Series", endpoint:"/tvseries" }
    ]
  }

  getAppList = () => {
    const { apps } = this.state;
		return apps.map(app => {
			return (
        <li className="nav-item sliding-middle-out logged-in" key={app.id}><NavLink to={ app.endpoint }>{ app.name }</NavLink></li>
			)
		})
	}

  getOtherList = () => {
    return (
      <ul className="navbar-nav navbar-right">
        <li className="nav-item sliding-middle-out logged-in" key="1"><NavLink to="/settings">Settings</NavLink></li>
        <li className="nav-item sliding-middle-out logged-in" key="2"><NavLink to="/logout">Logout</NavLink></li>
        <li className="nav-item sliding-middle-out logged-out" key="1"><NavLink to="/login">Login</NavLink></li>
        <li className="nav-item sliding-middle-out logged-out" key="2"><NavLink to="/register">Register</NavLink></li>
      </ul>
    )
  }

  render() {
    const appList = this.getAppList();
    const otherList = this.getOtherList();

    return (
      <nav className="nav-wrapper grey darken-3">
        <div className="container">
          <Link to='/' className="brand-logo">MarioPlan</Link>
          <LoggedInLinks />
          <LoggedOutLinks />
        </div>
      </nav>
    );
  }
}

export default Header;
