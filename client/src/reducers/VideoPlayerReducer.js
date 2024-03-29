// eslint-disable-next-line complexity
export const videoPlayerReducer = (state, action) => {
	let { videos, x, y, height, width, minimized, selectedTab, showQueue, currentVideo } = state;

	switch (action.type) {
		case "ADD_VIDEO":
			if (!action.video.videoSource) action.video.videoSource = action.videoSource;

			if (!videos[action.videoSource].find(v => v.url === action.video.url)) {
				if (action.videoSource === "twitchStream") {
					videos = { ...videos, [action.videoSource]: [action.video] };
				} else {
					videos = { ...videos, [action.videoSource]: [...videos[action.videoSource], action.video] };
				}
			}

			if (action.videoSource !== selectedTab) {
				selectedTab = action.videoSource;
				currentVideo = action.videoSource === "twitchStream" ? action.video : videos[selectedTab][0];
			}

			return { ...state, videos, selectedTab, currentVideo };
		case "SET_VIDEOS":
			videos = {
				...videos,
				[action.videoSource]: action.videos,
			};
			currentVideo = videos[action.videoSource][0];

			return { ...state, videos, currentVideo };
		case "DELETE_VIDEO":
			videos = {
				...videos,
				[action.videoSource]: videos[action.videoSource].filter(v => v.url !== action.video.url),
			};

			if (!videos[action.videoSource].length) {
				const sources = Object.keys(videos);
				const videosBySource = sources.map(source => videos[source].length);
				const nextTabIndex = videosBySource.findIndex(numberOfVideos => numberOfVideos > 0);

				if (selectedTab === "youtubePlaylists") {
					currentVideo = null;
				} else {
					selectedTab = nextTabIndex >= 0 && sources[nextTabIndex];
					currentVideo = nextTabIndex >= 0 && videos[selectedTab][0];
				}
			} else if (currentVideo.url === action.video.url) {
				currentVideo = videos[selectedTab][0];
			}

			return { ...state, videos, selectedTab, currentVideo };
		case "DELETE_VIDEOS":
			videos = {
				...videos,
				[action.videoSource]: [],
			};

			const sources = Object.keys(videos);
			const videosBySource = sources.map(source => videos[source].length);
			const nextTabIndex = videosBySource.findIndex(numberOfVideos => numberOfVideos > 0);

			if (selectedTab === "youtubePlaylists") {
				currentVideo = null;
			} else {
				selectedTab = nextTabIndex >= 0 && sources[nextTabIndex];
				currentVideo = nextTabIndex >= 0 && videos[selectedTab][0];
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
		case "SET_SHOW_QUEUE":
			showQueue = action.showQueue;

			return { ...state, showQueue };
		case "SET_CURRENT_VIDEO":
			currentVideo = action.currentVideo;

			return { ...state, currentVideo };
		default:
			return state;
	}
};
