export const videoPlayerReducer = (state, action) => {
	let { videos, x, y, height, width, minimized } = state;

	switch (action.type) {
		case "ADD_VIDEO":
			if (!videos.find(v => v.url === action.video.url)) videos.push(action.video);

			return { ...state, videos };
		case "DELETE_VIDEO":
			videos = videos.filter(v => v.url !== action.video.url);

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
