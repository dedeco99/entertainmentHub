import React, { Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";

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

class App extends Component {
	componentDidMount() {
		const { addNotification } = this.props;

		const socket = socketIOClient("http://localhost:5000");

		socket.on("notification", data => {
			addNotification(data);
		});
	}

	render() {
		console.log("good");
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
							{
								/*
								<PrivateRoute exact path="/reddit/:sub?/:category?" component={Reddit} />
								<PrivateRoute exact path="/youtube" component={Youtube} />
								<PrivateRoute exact path="/twitch" component={Twitch} />
								*/
							}
							<PrivateRoute exact path="/tv" component={TV} />

							<PrivateRoute exact path="/settings" component={Settings} />
						</Switch>
					</div>
				</div>
			</BrowserRouter>
		);
	}
}

App.propTypes = {
	addNotification: PropTypes.func,
};

const mapDispatchToProps = dispatch => {
	return {
		addNotification: notification => dispatch({ type: "ADD_NOTIFICATION", notification }),
	};
};

export default connect(null, mapDispatchToProps)(App);
