export const videoPlayerReducer = (state, action) => {
	let { videos, x, y, height, width } = state;

	switch (action.type) {
		case "ADD_VIDEO":
			if (!videos.find(v => v.url === action.video.url)) videos.push(action.video);

			return { ...state, videos };
		case "REMOVE_VIDEO":
			videos = videos.filter(v => v.url !== action.video.url);

			return { ...state, videos };

		case "CHANGE_POSITION":
			x = action.position.x;
			y = action.position.y;

			return { ...state, x, y };

		case "CHANGE_DIMENSIONS":
			height = action.dimensions.height;
			width = action.dimensions.width;

			return { ...state, height, width };
		default:
			return state;
	}
};
