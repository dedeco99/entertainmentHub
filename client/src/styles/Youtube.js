const youtube = {
	root: {
		width: "100%",
	},
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	modalContent: {
		display: "flex",
		flexDirection: "column",
		backgroundColor: "#212121",
		height: "80%",
		width: 400,
		outline: "none",
	},
	modalFooter: {
		backgroundColor: "#424242",
		padding: 8,
	},
};

const feed = {
	header: {
		backgroundColor: "#424242",
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 16,
		width: "100%",
	},
	videoTitle: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		display: "-webkit-box",
		WebkitLineClamp: 2,
		WebkitBoxOrient: "vertical",
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

export { youtube, feed };
