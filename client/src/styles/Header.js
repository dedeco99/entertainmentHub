const header = () => ({
	appBar: {
		backgroundColor: "#222",
		marginBottom: 20,
	},
	title: {
		flexGrow: 1,
		marginLeft: 50,
	},
});

const loggedInLinks = () => ({
	navBtn: {
		marginRight: 20,
	},
});

const notificationDropdown = () => ({
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
});

const settings = () => ({
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
});

const appMenu = () => ({
	appItem: {
		paddingLeft: 10,
	},
});

export {
	header,
	loggedInLinks,
	notificationDropdown,
	settings,
	appMenu,
};
