export const videoPlayerReducer = (state, action) => {
	let { videos, x, y, height, width, minimized } = state;

	switch (action.type) {
		case "ADD_VIDEO":
			if (!videos[action.videoSource].find(v => v.url === action.video.url)) {
				videos = { ...videos, [action.videoSource]: [...videos[action.videoSource], action.video] };
			}

			return { ...state, videos };
		case "DELETE_VIDEO":
			videos = { ...videos, [action.videoSource]: videos[action.videoSource].filter(v => v.url !== action.video.url) };

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
		default:
			return state;
	}
};
