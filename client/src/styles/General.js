const general = {
	main: {
		margin: "75px 15px 15px 65px",
	},
	center: {
		textAlign: "center",
	},
	goBackUp: {
		bottom: 65,
		right: 15,
		position: "fixed",
		cursor: "pointer",
		zIndex: 1,
	},
	listMenu: {
		backgroundColor: "#222",
		padding: 0,
		maxHeight: "80vh",
		overflow: "auto",
		position: "sticky",
		top: "16px",
	},
	horizontal: {
		display: "flex",
		flexDirection: "row",
		textAlign: "center",
		overflowX: "auto",
	},
	loading: {
		width: "100%",
		height: "100%",
		paddingTop: "50%",
		position: "absolute",
		zIndex: 1000,
	},
	loadingImg: {
		width: "100%",
		maxWidth: 300,
	},
	bottomRightOverlay: {
		position: "absolute",
		bottom: 0,
		right: 0,
		backgroundColor: "#212121dd",
		padding: 2,
	},
	outlinedBtn: {
		marginTop: 10,
		marginBottom: 10,
	},
	speedDial: {
		bottom: 15,
		left: -3,
		position: "fixed",
	},
};

export default general;
