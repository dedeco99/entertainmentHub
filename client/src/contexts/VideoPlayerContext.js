import React, { createContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";

import { videoPlayerReducer } from "../reducers/VideoPlayerReducer";

export const VideoPlayerContext = createContext();

const VideoPlayerContextProvider = ({ children }) => {
	const initState = {
		videos: [],
		x: null,
		y: null,
		width: 600,
		height: 300,
		minimized: false,
	};

	const [state, dispatch] = useReducer(videoPlayerReducer, initState, () => {
		const localData = localStorage.getItem("videoPlayer");
		return localData ? JSON.parse(localData) : initState;
	});

	useEffect(() => {
		localStorage.setItem("videoPlayer", JSON.stringify(state));
	}, [state]);

	return <VideoPlayerContext.Provider value={{ state, dispatch }}>{children}</VideoPlayerContext.Provider>;
};

VideoPlayerContextProvider.propTypes = {
	children: PropTypes.object.isRequired,
};

export default VideoPlayerContextProvider;