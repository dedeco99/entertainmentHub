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
	previous: {
		fontSize: "2em",
		top: "50%",
		left: "5px",
	},
	next: {
		fontSize: "2em",
		top: "50%",
		right: "5px",
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