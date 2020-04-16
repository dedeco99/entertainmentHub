const styles = {
	root: {
		position: "relative",
		backgroundColor: "#212121",
		height: "100%",
	},
	media: {
		width: "100%",
		height: "100%",
	},
	overlay: {
		position: "absolute",
		color: "white",
		backgroundColor: "#212121dd",
		padding: "3px",
		borderRadius: "3px",
	},
	title: {
		top: "5px",
		left: "5px",
		maxWidth: "95%",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
	arrow: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		top: "50%",
		borderRadius: "50%",
		cursor: "pointer",
		width: 40,
		height: 40,
		"&:hover": {
			backgroundColor: "#424242",
		},
	},
	previous: {
		left: "7px",
	},
	next: {
		right: "7px",
	},
	score: {
		bottom: "5px",
		left: "5px",
	},
	date: {
		bottom: "5px",
		right: "5px",
	},
	hide: {
		display: "none",
	},
};

export default styles;