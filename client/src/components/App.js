import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";

import Header from "./header/Header";
import Index from "./Index";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Apps from "./auth/Apps";
/*
import Reddit from "./reddit/Reddit";
import Youtube from "./youtube/Youtube";
import Twitch from "./twitch/Twitch";
*/
import TV from "./tv/TV";
import Settings from "./settings/Settings";

import "../css/App.css";

function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<Header />
				<div className="main">
					<Switch>
						<Route exact path="/" component={Index} />
						<Route exact path="/register" component={Register} />
						<Route exact path="/login" component={Login} />
						<PrivateRoute exact path="/apps/:app" component={Apps} />
						{/*
						<PrivateRoute exact path="/reddit/:sub?/:category?" component={Reddit} />
						<PrivateRoute exact path="/youtube" component={Youtube} />
						<PrivateRoute exact path="/twitch" component={Twitch} />
						*/}
						<PrivateRoute exact path="/tv" component={TV} />

						<PrivateRoute exact path="/settings" component={Settings} />
					</Switch>
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
