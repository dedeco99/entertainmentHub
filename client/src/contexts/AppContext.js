import React, { createContext, useReducer } from "react";
import PropTypes from "prop-types";

import { appReducer } from "../reducers/AppReducer";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
	const REDIRECT = process.env.REACT_APP_REDIRECT_URL;

	const initState = {
		allApps: {
			reddit: {
				platform: "reddit",
				displayName: "Reddit",
				icon: "icon-reddit",
				menuIcon: "icon-reddit-filled icon-2x",
				link: `https://www.reddit.com/api/v1/authorize
			?client_id=VXMNKvXfKALA3A
			&response_type=code
			&state=some_state
			&redirect_uri=${REDIRECT}/apps/reddit
			&duration=permanent
			&scope=read,mysubreddits`,
				endpoint: "/reddit",
				color: "#fd4500",
			},
			twitch: {
				platform: "twitch",
				displayName: "Twitch",
				icon: "icon-twitch",
				menuIcon: "icon-twitch-filled icon-2x",
				link: `https://api.twitch.tv/kraken/oauth2/authorize
			?client_id=9haxv452ih4k8ewiml53vqetrbm0z9q
			&response_type=code
			&redirect_uri=${REDIRECT}/apps/twitch
			&scope=user_read`,
				endpoint: "/twitch",
				color: "#6441a5",
			},
			youtube: {
				platform: "youtube",
				displayName: "Youtube",
				icon: "icon-youtube-filled",
				menuIcon: "icon-youtube-filled icon-2x",
				link: `https://accounts.google.com/o/oauth2/v2/auth
			?redirect_uri=${REDIRECT}/apps/youtube
			&prompt=consent
			&access_type=offline
			&response_type=code
			&client_id=539994951120-kabifq9ct2lbk92m9ef4hddc5f57nksl.apps.googleusercontent.com
			&scope=https://www.googleapis.com/auth/youtube`,
				endpoint: "/youtube",
				color: "linear-gradient(0deg, rgba(226,43,40,1) 0%, rgba(191,31,19,1) 100%)",
			},
			gmail: {
				platform: "gmail",
				displayName: "Gmail",
				icon: "icon-monitor",
				menuIcon: "icon-monitor-filled icon-2x",
				link: `https://accounts.google.com/o/oauth2/v2/auth
			?redirect_uri=${REDIRECT}/apps/gmail
			&prompt=consent
			&access_type=offline
			&response_type=code
			&client_id=539994951120-kabifq9ct2lbk92m9ef4hddc5f57nksl.apps.googleusercontent.com
			&scope=https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify`,
				color: "linear-gradient(0deg, rgba(1,97,234,1) 0%, rgba(0,187,250,1) 100%)",
			},
			tv: {
				platform: "tv",
				displayName: "TV",
				icon: "icon-monitor",
				menuIcon: "icon-monitor-filled icon-2x",
				link: "/apps/tv",
				endpoint: "/tv",
				color: "linear-gradient(0deg, rgba(1,97,234,1) 0%, rgba(0,187,250,1) 100%)",
			},
			reminders: {
				platform: "reminders",
				displayName: "Reminders",
				icon: "icon-notifications",
				menuIcon: "icon-notifications icon-2x",
				link: "/apps/reminders",
				endpoint: "/reminders",
				color: "linear-gradient(0deg, rgba(1,97,234,1) 0%, rgba(0,187,250,1) 100%)",
			},
		},
		apps: [],
	};

	const [state, dispatch] = useReducer(appReducer, initState);

	return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
	children: PropTypes.object.isRequired,
};

export default AppContextProvider;
