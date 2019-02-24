import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../css/Header.css';
import logo from '../img/logo.png';
import settings from '../img/settingsButton.png';

class Header extends Component {
  state = {
    apps:[
      { id:1, name: "Reddit", endpoint:"/reddit" },
      { id:2, name: "Youtube", endpoint:"/youtube" },
      { id:3, name: "Twitch", endpoint:"/twitch" },
      { id:4, name: "TV Series", endpoint:"/tvseries" }
    ]
  }

  render() {
    const { apps } = this.state;
		const appList = apps.map(app => {
			return (
        <li className="nav-item sliding-middle-out" key={app.id}><NavLink to={ app.endpoint }>{ app.name }</NavLink></li>
			)
		})

    return (
      <div className="Header">
        <nav className="navbar navbar-expand-sm fixed-top dark">
					<Link className="navbar-brand" to="/">
            <img src={logo} width="50px" alt="Logo" />
          </Link>
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#appNavbar" aria-expanded="false">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="navbar-collapse collapse" id="appNavbar">
						<ul className="navbar-nav mr-auto" id="apps">
							{ appList }
						</ul>
						<ul className="navbar-nav navbar-right">
							<li className="nav-item"><NavLink to="/settings"><img src={settings} width="25px" alt="Settings"/></NavLink></li>
							<li className="nav-item sliding-middle-out"><NavLink to="/logout">Logout</NavLink></li>
						</ul>
					</div>
				</nav>
        <br/><br/><br/><br/>
      </div>
    );
  }
}

export default Header;
