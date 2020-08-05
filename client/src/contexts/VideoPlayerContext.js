import React, { createContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";

import { videoPlayerReducer } from "../reducers/VideoPlayerReducer";

export const VideoPlayerContext = createContext();

const VideoPlayerContextProvider = ({ children }) => {
	const initState = { videos: [] };

	const [videos, dispatch] = useReducer(videoPlayerReducer, initState, () => {
		const localData = localStorage.getItem("videoPlayerQueue");
		return localData ? JSON.parse(localData) : initState;
	});

	useEffect(() => {
		localStorage.setItem("videoPlayerQueue", JSON.stringify(videos));
	}, [videos]);

	return <VideoPlayerContext.Provider value={{ state: videos, dispatch }}>{children}</VideoPlayerContext.Provider>;
};

VideoPlayerContextProvider.propTypes = {
	children: PropTypes.object.isRequired,
};

export default VideoPlayerContextProvider;
