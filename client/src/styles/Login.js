const login = {
	root: {
		width: "100%",
		height: "100%",
		top: 0,
		left: 0,
		position: "absolute",
		overflow: "hidden",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	container: {
		minWidth: 400,
	},
	formContainer: {
		padding: 20,
	},
	sideImageContainer: {
		height: "100%",
		maxWidth: "60%",
		top: 0,
		right: 0,
		position: "absolute",
		zIndex: -1,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	sideImage: {
		maxHeight: "100%",
		width: "100%",
		filter: "brightness(50%) sepia(70%) hue-rotate(-35deg) saturate(500%)",
	},
	createAccount: {
		cursor: "pointer",
		"&:hover": {
			textDecoration: "underline",
		},
	},
};

export { login };
