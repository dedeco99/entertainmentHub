import { makeStyles } from "@material-ui/styles";

const header = makeStyles({
	appBar: {
		backgroundColor: "#222",
		marginBottom: 20,
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
});

const appMenu = () => ({
	root: {
		backgroundColor: "#222",
		width: "50px",
		height: "100%",
		top: 0,
		left: 0,
		marginTop: 65,
		position: "fixed",
	},
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
