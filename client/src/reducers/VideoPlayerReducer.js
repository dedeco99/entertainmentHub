export const videoPlayerReducer = (state, action) => {
	let { videos, x, y, height, width, minimized, selectedTab, currentVideo } = state;

	switch (action.type) {
		case "ADD_VIDEO":
			if (!videos[action.videoSource].find(v => v.url === action.video.url)) {
				if (action.videoSource === "twitch") {
					videos = { ...videos, [action.videoSource]: [action.video] };
				} else {
					videos = { ...videos, [action.videoSource]: [...videos[action.videoSource], action.video] };
				}
			}

			if (action.videoSource !== selectedTab) {
				selectedTab = action.videoSource;
				currentVideo = action.videoSource === "twitch" ? action.video : videos[selectedTab][0];
			}

			return { ...state, videos, selectedTab, currentVideo };
		case "DELETE_VIDEO":
			videos = {
				...videos,
				[action.videoSource]: videos[action.videoSource].filter(v => v.url !== action.video.url),
			};

			if (!videos[action.videoSource].length) {
				const sources = Object.keys(videos);
				const videosBySource = sources.map(source => videos[source].length);
				const nextTabIndex = videosBySource.findIndex(numberOfVideos => numberOfVideos > 0);

				selectedTab = nextTabIndex >= 0 && sources[nextTabIndex];
				currentVideo = nextTabIndex >= 0 && videos[selectedTab][0];
			} else if (currentVideo.url === action.video.url) {
				currentVideo = videos[selectedTab][0];
			}

			return { ...state, videos, selectedTab, currentVideo };
		case "CHANGE_ORDER":
			videos[action.videoSource].splice(
				action.newPosition,
				0,
				videos[action.videoSource].splice(action.oldPosition, 1)[0],
			);

			return { ...state, videos };
		case "SET_POSITION":
			x = action.position.x;
			y = action.position.y;

			return { ...state, x, y };
		case "SET_DIMENSIONS":
			height = action.dimensions.height;
			width = action.dimensions.width;

			return { ...state, height, width };
		case "SET_MINIMIZED":
			minimized = action.minimized;

			return { ...state, minimized };
		case "SET_SELECTED_TAB":
			selectedTab = action.selectedTab;
			currentVideo = videos[selectedTab][0];

			return { ...state, selectedTab, currentVideo };
		case "SET_CURRENT_VIDEO":
			currentVideo = action.currentVideo;

			return { ...state, currentVideo };
		default:
			return state;
	}
};
