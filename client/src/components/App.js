import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { makeStyles, ThemeProvider, createMuiTheme, CssBaseline } from "@material-ui/core";

import BackUpButton from "./.partials/BackUpButton";
import SocketClient from "./.partials/SocketClient";
import PrivateRoute from "./auth/PrivateRoute";
import Header from "./header/Header";
import Index from "./index/Index";
import Login from "./auth/Login";
import Youtube from "./youtube/Youtube";
import Reddit from "./reddit/Reddit";
import Twitch from "./twitch/Twitch";
import TV from "./tv/TV";
import Reminders from "./reminders/Reminders";
import Settings from "./settings/Settings";
import Apps from "./settings/Apps";
import VideoPlayer from "./videoPlayer/VideoPlayer";

import UserContextProvider from "../contexts/UserContext";
import NotificationContextProvider from "../contexts/NotificationContext";
import WidgetContextProvider from "../contexts/WidgetContext";
import YoutubeContextProvider from "../contexts/YoutubeContext";
import TwitchContextProvider from "../contexts/TwitchContext";
import RedditContextProvider from "../contexts/RedditContext";
import TVContextProvider from "../contexts/TVContext";
import VideoPlayerContextProvider from "../contexts/VideoPlayerContext";

import styles from "../styles/General";

const useStyles = makeStyles(styles);

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
			light: "#ec6e4c",
			main: "#ec6e4c",
			dark: "#ec6e4c",
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

function App() {
	const classes = useStyles();

	function renderRoutes() {
		return (
			<Switch>
				<Route exact path="/" component={Index} />
				<Route exact path="/login" component={Login} />

				<PrivateRoute exact path="/apps/:app" component={Apps} />

				<PrivateRoute exact path="/youtube" component={Youtube} />
				<PrivateRoute exact path="/youtube/:channel" component={Youtube} />

				<PrivateRoute exact path="/reddit" component={Reddit} />
				<PrivateRoute exact path="/reddit/:sub" component={Reddit} />
				<PrivateRoute exact path="/reddit/:sub/:category" component={Reddit} />

				<PrivateRoute exact path="/twitch" component={Twitch} />

				<PrivateRoute exact path="/tv" component={TV} />
				<PrivateRoute exact path="/tv/all" component={TV} />
				<PrivateRoute exact path="/tv/popular" component={TV} />
				<PrivateRoute exact path="/tv/:seriesId" component={TV} />
				<PrivateRoute exact path="/tv/:seriesId/:season" component={TV} />

				<PrivateRoute exact path="/reminders" component={Reminders} />

				<PrivateRoute exact path="/settings" component={Settings} />
				<PrivateRoute exact path="/settings/apps" component={Settings} />
			</Switch>
		);
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<UserContextProvider>
				<NotificationContextProvider>
					<WidgetContextProvider>
						<YoutubeContextProvider>
							<TwitchContextProvider>
								<RedditContextProvider>
									<TVContextProvider>
										<VideoPlayerContextProvider>
											<BrowserRouter>
												<Header />
												<div className={classes.main}>{renderRoutes()}</div>
												<BackUpButton />
												<VideoPlayer />
												<ToastContainer position="bottom-right" newestOnTop />
												<SocketClient />
											</BrowserRouter>
										</VideoPlayerContextProvider>
									</TVContextProvider>
								</RedditContextProvider>
							</TwitchContextProvider>
						</YoutubeContextProvider>
					</WidgetContextProvider>
				</NotificationContextProvider>
			</UserContextProvider>
		</ThemeProvider>
	);
}
export default App;
