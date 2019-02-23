import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../img/logo.png';
import settings from '../img/settingsButton.png';

class Header extends Component {
  render() {
    return (
      <div className="Header">
				<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
					<Link class="navbar-brand" to="/">
            <img src={logo} width="50px" alt="Logo" />
          </Link>
					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#appNavbar" aria-expanded="false">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="navbar-collapse collapse" id="appNavbar">
						<ul class="navbar-nav mr-auto" id="apps">
							<li class="nav-item sliding-middle-out"><NavLink to="/reddit">Reddit</NavLink></li>
							<li class="nav-item sliding-middle-out"><NavLink to="/youtube">Youtube</NavLink></li>
							<li class="nav-item sliding-middle-out"><NavLink to="/twitch">Twitch</NavLink></li>
							<li class="nav-item sliding-middle-out"><NavLink to="/tvseries">TV Series</NavLink></li>
						</ul>
						<ul class="navbar-nav navbar-right">
							<li class="nav-item"><a class="nav-link" href="/settings"><img src={settings} width="25px" alt="Settings"/></a></li>
							<li class="nav-item sliding-middle-out"><a class="logout nav-link" href="/logout">Logout</a></li>
						</ul>
					</div>
				</nav>
        <br/><br/><br/><br/>
      </div>
    );
  }
}

export default Header;
