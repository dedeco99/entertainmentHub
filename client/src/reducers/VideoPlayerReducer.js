export const videoPlayerReducer = (state, action) => {
	let { videos } = state;

	switch (action.type) {
		case "ADD_VIDEO":
			if (!videos.find(v => v.url === action.video.url)) videos.push(action.video);

			return { videos };
		case "REMOVE_VIDEO":
			videos = videos.filter(v => v.url !== action.video.url);

			return { videos };
		default:
			return state;
	}
};
