const styles = {
	root: {
		position: "relative",
		backgroundColor: "#212121",
		height: "100%",
	},
	wrapper: {
		height: "100%",
	},
	content: {
		overflowY: "auto",
		overflowX: "hidden",
		position: "relative",
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
	textHeader: {
		padding: 16,
		boxSizing: "border-box",
		borderBottom: "1px solid #424242",
	},
	textContent: {
		padding: 16,
		paddingTop: 0,
		boxSizing: "border-box",
		"& p": {
			fontSize: "1rem",
			fontWeight: 400,
			lineHeight: 1.5,
			letterSpacing: 0.00938,
		},
		"& *": {
			overflow: "hidden",
		},
	},
	arrows: {
		backgroundColor: "#424242",
		"& div": {
			padding: 12,
			cursor: "pointer",
			"&:hover": {
				backgroundColor: "#3d3d3d",
			},
		},
	},
	arrowsBorder: {
		borderRight: "1px solid #212121",
	},
	widthFix: {
		width: "100%",
	},
};

export default styles;