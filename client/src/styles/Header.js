import { makeStyles } from "@material-ui/styles";

const header = makeStyles({
	appBar: {
		backgroundColor: "#222",
		marginBottom: 20,
		zIndex: 0,
		position: "absolute",
	},
	brand: {
		left: 0,
		bottom: -3,
		position: "absolute",
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
});

const appMenu = () => ({
	root: {
		backgroundColor: "#222",
		width: "50px",
		height: "100%",
		top: 0,
		left: 0,
		paddingTop: 60,
		position: "fixed",
	},
	appLink: {
		textDecoration: "none",
		color: "white",
	},
	appItem: {
		paddingLeft: 10,
	},
});

export { header, loggedInLinks, notificationDropdown, settings, appMenu };
