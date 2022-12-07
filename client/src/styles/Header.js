const header = {
	appBar: {
		backgroundColor: "#222",
		marginBottom: 20,
		position: "absolute",
	},
	brand: {
		flexGrow: 1,
		marginLeft: 30,
	},
};

const loggedInLinks = {
	wrapper: {
		"& > div": {
			marginLeft: 10,
		},
	},
};

const userDropdown = {
	avatar: {
		color: "white",
		backgroundColor: "#ec6e4c",
	},
	wrapper: {
		display: "inline-block",
		position: "relative",
	},
	paper: {
		position: "absolute",
		width: 250,
		right: 0,
	},
};

const notificationDropdown = {
	wrapper: {
		display: "inline-block",
		position: "relative",
	},
	paper: {
		position: "absolute",
		width: 400,
		right: 0,
		backgroundColor: "#212121",
	},
};

const settings = {
	appsContainer: {
		position: "relative",
	},
	appIcon: {
		color: "white",
		fontSize: "2em",
	},
	settingsContainer: {
		display: "flex",
		flexDirection: "column",
		padding: 16,
		backgroundColor: "#212121",
		"& button": {
			alignSelf: "flex-end",
		},
	},
	listMenu: {
		backgroundColor: "#222",
		padding: 0,
	},
	delete: {
		position: "absolute",
		fontSize: "2em",
		top: 5,
		right: 5,
		cursor: "pointer",
	},
};

const appMenu = {
	root: {
		backgroundColor: "#222",
		width: "50px",
		height: "100%",
		top: 0,
		left: 0,
		paddingTop: 60,
		position: "fixed",
		"& .Mui-selected": {
			color: "#ec6e4c",
			backgroundColor: "#ec6e4c25",
			"&:hover": {
				backgroundColor: "#ec6e4c25",
			},
		},
	},
	appLink: {
		textDecoration: "none",
		color: "white",
	},
	appItem: {
		paddingLeft: 10,
		"&:hover": {
			color: "#ec6e4c",
			backgroundColor: "#ec6e4c25",
		},
	},
};

export { header, loggedInLinks, userDropdown, notificationDropdown, settings, appMenu };
