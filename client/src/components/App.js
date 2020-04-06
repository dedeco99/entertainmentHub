import React, { Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import socketio from "socket.io-client";
import { ToastContainer } from "react-toastify";

import PrivateRoute from "./auth/PrivateRoute";
import Header from "./header/Header";
import AppMenu from "./header/AppMenu";
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

import goBackUp from "../img/go_back_up.png";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

class App extends Component {
	constructor() {
		super();
		this.state = {
			showGoBackUpButton: false,
		};
	}

	componentDidMount() {
		const { addNotification } = this.props;

		document.title = "EntertainmentHub";

		const socket = socketio("http://localhost:5000", { transports: ["websocket"] });

		socket.on("connect", () => {
			const user = localStorage.getItem("user");
			socket.emit("bind", user);
		});

		socket.on("notification", data => {
			addNotification(data);
		});

		window.addEventListener("scroll", () => {
			const { showGoBackUpButton } = this.state;

			const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

			const height = document.documentElement.scrollHeight -
				document.documentElement.clientHeight;

			const scrolled = winScroll / height;

			if (scrolled > 0.75 && !showGoBackUpButton) {
				this.setState({ showGoBackUpButton: true });
			} else if (scrolled === 0) {
				this.setState({ showGoBackUpButton: false });
			}
		});
	}

	goBackUp() {
		window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
	}

	renderGoBackUpButton() {
		const { showGoBackUpButton } = this.state;

		if (showGoBackUpButton) {
			return (
				<div className="go-back-up" onClick={this.goBackUp}>
					<img src={goBackUp} width="50px" alt="Go Back Up" />
				</div>
			);
		}

		return null;
	}

	render() {
		return (
			<ThemeProvider theme={createMuiTheme({ palette: { type: "dark" } })}>
				<BrowserRouter>
					<div className="App">
						<Header />
						<AppMenu />
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
						{this.renderGoBackUpButton()}
						<ToastContainer
							position="bottom-right"
							newestOnTop
						/>
					</div>
				</BrowserRouter>
			</ThemeProvider>
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
