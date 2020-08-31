import React, { createContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";

import { videoPlayerReducer } from "../reducers/VideoPlayerReducer";

export const VideoPlayerContext = createContext();

const VideoPlayerContextProvider = ({ children }) => {
	const initState = {
		videos: {
			youtube: [],
			twitch: [],
		},
		x: null,
		y: null,
		width: 600,
		height: 300,
		minimized: false,
	};

	const [state, dispatch] = useReducer(videoPlayerReducer, initState, () => {
		const localData = localStorage.getItem("videoPlayer");

		if (localData) {
			const parsedData = JSON.parse(localData);
			if (parsedData.videos.youtube === undefined) {
				parsedData.videos = {
					youtube: parsedData.videos,
					twitch: [],
				};
			}
			return parsedData;
		}

		return initState;
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
