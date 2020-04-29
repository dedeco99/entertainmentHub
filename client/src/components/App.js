import React, { Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import socketio from "socket.io-client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PrivateRoute from "./auth/PrivateRoute";
import Header from "./header/Header";
import AppMenu from "./header/AppMenu";
import Index from "./index/Index";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Youtube from "./youtube/Youtube";
// import Reddit from "./reddit/Reddit";
import Twitch from "./twitch/Twitch";
import TV from "./tv/TV";
import Settings from "./settings/Settings";
import Apps from "./settings/Apps";

import "../styles/App.css";

import goBackUp from "../img/go_back_up.png";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme({
	palette: {
		type: "dark",
	},
	overrides: {
		MuiButton: {
			contained: {
				backgroundColor: "white",
				"& span": {
					color: "black !important",
				},
			},
		},
	},
});

class App extends Component {
	constructor() {
		super();
		this.state = {
			showGoBackUpButton: false,
		};
	}

	componentDidMount() {
		const { addNotification } = this.props;

		const socket = socketio("http://entertainmenthub.ddns.net:5000", { transports: ["websocket"] });

		socket.on("connect", () => {
			let user = null;
			try {
				user = JSON.parse(localStorage.getItem("user"));
			} catch (err) {
				user = localStorage.getItem("user");
			}

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

	handleGoBackUp() {
		window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
	}

	renderGoBackUpButton() {
		const { showGoBackUpButton } = this.state;

		if (showGoBackUpButton) {
			return (
				<div className="go-back-up" onClick={this.handleGoBackUp}>
					<img src={goBackUp} width="50px" alt="Go Back Up" />
				</div>
			);
		}

		return null;
	}

	renderRoutes() {
		return (
			<Switch>
				<Route exact path="/" component={Index} />
				<Route exact path="/register" component={Register} />
				<Route exact path="/login" component={Login} />
				<PrivateRoute exact path="/apps/:app" component={Apps} />
				<PrivateRoute exact path="/youtube" component={Youtube} />
				{/* <PrivateRoute exact path="/reddit/:sub?/:category?" component={Reddit} /> */}
				<PrivateRoute exact path="/twitch" component={Twitch} />
				<PrivateRoute exact path="/tv" component={TV} />
				<PrivateRoute exact path="/tv/all" component={TV} />
				<PrivateRoute exact path="/tv/popular" component={TV} />
				<PrivateRoute exact path="/tv/:seriesId" component={TV} />
				<PrivateRoute exact path="/tv/:seriesId/:season" component={TV} />

				<PrivateRoute exact path="/settings" component={Settings} />
			</Switch>
		);
	}

	render() {
		return (
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<div className="App">
						<Header />
						<AppMenu />
						<div className="main">
							{this.renderRoutes()}
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
	addNotification: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
	addNotification: notification => dispatch({ type: "ADD_NOTIFICATION", notification }),
});

export default connect(null, mapDispatchToProps)(App);
