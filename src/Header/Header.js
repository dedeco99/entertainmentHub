import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import logo from'./img/logo.png';
import settings from'./img/settingsButton.png';

class Header extends Component {
  render() {
    return (
      <div className="Header">
				<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
					<img class="navbar-brand" src={logo} width="50px" alt="Logo" />
					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#appNavbar" aria-expanded="false">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="navbar-collapse collapse" id="appNavbar">
						<ul class="navbar-nav mr-auto" id="apps">
							<li class="nav-item sliding-middle-out"><a class="app nav-link" href="/reddit">Reddit</a></li>
							<li class="nav-item sliding-middle-out"><a class="app nav-link" href="/youtube">Youtube</a></li>
							<li class="nav-item sliding-middle-out"><a class="app nav-link" href="/twitch">Twitch</a></li>
							<li class="nav-item sliding-middle-out"><a class="app nav-link" href="/tvseries">TV Series</a></li>
						</ul>
						<ul class="navbar-nav navbar-right">
							<li class="nav-item"><a class="nav-link" href="/settings"><img src={settings} width="25px" alt="Settings"/></a></li>
							<li class="nav-item sliding-middle-out"><a class="logout nav-link" href="/logout">Logout</a></li>
						</ul>
					</div>
				</nav>
      </div>
    );
  }
}

export default Header;
