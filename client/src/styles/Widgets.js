const widget = () => ({
	edit: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		backgroundColor: "#212121",
		height: "100%",
		width: "100%",
	},
	delete: {
		top: 0,
		right: 0,
		position: "absolute",
	},
});

const widgetDetail = () => ({
	autocomplete: {
		width: 300,
	},
});

const notifications = () => ({
	root: {
		backgroundColor: "#212121",
	},
	header: {
		backgroundColor: "#424242",
		padding: 5,
		paddingLeft: 16,
		paddingRight: 8,
	},
	avatar: {
		backgroundColor: "#444",
	},
});

const weather = () => ({
	root: {
		display: "flex",
		flexDirection: "column",
		backgroundColor: "#212121dd",
		height: "100%",
		boxSizing: "border-box",
	},
	content: {
		padding: 16,
		paddingBottom: 0,
	},
	description: {
		textTransform: "capitalize",
	},
	info: {
		"display": "flex",
		"alignItems": "center",
		"& i": {
			fontSize: "1.5rem",
			marginRight: 4,
			marginBottom: 5,
			display: "inline-block",
		},
	},
	nextDays: {
		"& div": {
			"borderTop": "1px solid #121212",
			"borderRight": "1px solid #121212",
			"padding": "5px 2px 5px 2px",
			"& img": {
				width: 40,
				height: 40,
			},
		},
	},
	lastDay: {
		borderRight: "none !important",
	},
});

const tv = () => ({
	root: {
		width: "100%",
		flexGrow: 1,
		backgroundColor: "#212121",
		height: "100%",
	},
	indicator: {
		backgroundColor: "white",
	},
	tab: {
		minWidth: 50,
	},
	tabPanel: {
		height: "calc(100% - 48px)",
		overflow: "auto",
	},
	episodeList: {
		flexDirection: "column",
	},
	episodeName: {
		display: "flex",
		flexGrow: 1,
	},
	episodeDate: {
		display: "flex",
	},
	popularText: {
		paddingLeft: 10,
	},
});

const crypto = () => ({
	root: {
		height: "100%",
		boxSizing: "border-box",
		overflow: "auto",
		padding: 10,
		backgroundColor: "#212121",
		border: "1px solid #424242",
	},
	cell: {
		padding: 2,
	},
	nameCell: {
		maxWidth: 60,
	},
	listImage: {
		height: 16,
		width: 16,
		padding: 5,
	},
	singleRoot: {
		height: "100%",
		boxSizing: "border-box",
		backgroundColor: "#212121",
		padding: 16,
		border: "1px solid #424242",
	},
	singleContent: {
		paddingTop: 15,
		paddingBottom: 15,
		borderTop: "1px solid #424242",
	},
	singleHeader: {
		paddingBottom: 5,
	},
	singlePercentage: {
		width: 70,
		padding: 5,
		borderLeft: "1px solid #424242",
	},
	singleImage: {
		padding: 10,
		height: 36,
		width: 36,
	},
	green: {
		color: "#43a047 !important",
	},
	red: {
		color: "#f4511e !important",
	},
});

export {
	widget,
	widgetDetail,
	notifications,
	weather,
	tv,
	crypto,
};
