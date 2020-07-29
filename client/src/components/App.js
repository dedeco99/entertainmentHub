import React, { Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, withStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

import SocketClient from "./.partials/SocketClient";
import PrivateRoute from "./auth/PrivateRoute";
import Header from "./header/Header";
import Index from "./index/Index";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Youtube from "./youtube/Youtube";
import Reddit from "./reddit/Reddit";
import Twitch from "./twitch/Twitch";
import TV from "./tv/TV";
import Settings from "./settings/Settings";
import Apps from "./settings/Apps";

import UserContextProvider from "../contexts/UserContext";
import NotificationContextProvider from "../contexts/NotificationContext";
import WidgetContextProvider from "../contexts/WidgetContext";
import YoutubeContextProvider from "../contexts/YoutubeContext";
import TwitchContextProvider from "../contexts/TwitchContext";
import RedditContextProvider from "../contexts/RedditContext";

import goBackUp from "../img/go_back_up.png";

import styles from "../styles/General";

const theme = createMuiTheme({
	palette: {
		common: {
			black: "#000",
			white: "#fff",
		},
		background: {
			paper: "rgba(66, 66, 66, 1)",
			default: "#111",
		},
		primary: {
			light: "rgba(255, 255, 255, 0.7)",
			main: "rgba(255, 255, 255, 1)",
			dark: "rgba(255, 255, 255, 0.5)",
			contrastText: "rgba(0, 0, 0, 1)",
		},
		secondary: {
			light: "#ff4081",
			main: "#f50057",
			dark: "#c51162",
			contrastText: "#fff",
		},
		error: {
			light: "#e57373",
			main: "#f44336",
			dark: "#d32f2f",
			contrastText: "#fff",
		},
		text: {
			primary: "rgba(255, 255, 255, 1)",
			secondary: "rgba(255, 255, 255, 0.7)",
			disabled: "rgba(255, 255, 255, 0.5)",
			hint: "rgba(255, 255, 255, 0.3)",
		},
		action: {
			active: "#fff",
			hover: "rgba(255, 255, 255, 0.08)",
			selected: "rgba(255, 255, 255, 0.16)",
			disabled: "rgba(255, 255, 255, 0.3)",
			disabledBackground: "rgba(255, 255, 255, 0.12)",
		},
		divider: "rgba(255, 255, 255, 0.12)",
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
		window.addEventListener("scroll", () => {
			const { showGoBackUpButton } = this.state;

			const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

			const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

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
		const { classes } = this.props;
		const { showGoBackUpButton } = this.state;

		if (showGoBackUpButton) {
			return (
				<div className={classes.goBackUp} onClick={this.handleGoBackUp}>
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
				<PrivateRoute exact path="/reddit/:sub?/:category?" component={Reddit} />
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
		const { classes } = this.props;

		return (
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<UserContextProvider>
					<NotificationContextProvider>
						<WidgetContextProvider>
							<YoutubeContextProvider>
								<TwitchContextProvider>
									<RedditContextProvider>
										<BrowserRouter>
											<Header />
											<div className={classes.main}>{this.renderRoutes()}</div>
											{this.renderGoBackUpButton()}
											<ToastContainer position="bottom-right" newestOnTop />
											<SocketClient />
										</BrowserRouter>
									</RedditContextProvider>
								</TwitchContextProvider>
							</YoutubeContextProvider>
						</WidgetContextProvider>
					</NotificationContextProvider>
				</UserContextProvider>
			</ThemeProvider>
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
