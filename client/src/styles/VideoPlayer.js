const videoPlayer = {
	background: {
		backgroundColor: "#212121",
	},
	horizontalListItem: {
		width: "auto", 
		padding: "0"
	},
	playerContainer: {
		position: "fixed",
		zIndex: 1
	},
	videoThumbnail: {
		"&:hover": {
			"& $videoPlayOverlay": {
				display: "flex",
			},
		},
	},
	videoPlayOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		display: "none",
		backgroundColor: "#212121DD",
		cursor: "pointer",
	},
};

export { videoPlayer };
