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
};

const videos = {
	root: {
		backgroundColor: "#212121",
		width: "100%",
		height: "100%",
		borderRadius: 3,
	},
};

export { youtube, feed, videos };
