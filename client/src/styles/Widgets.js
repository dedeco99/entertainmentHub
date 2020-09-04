const widgets = {
	root: {
		width: "100%",
		height: "100%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		paddingTop: "50%",
		cursor: "pointer",
	},
};

const widget = {
	root: props => ({
		backgroundColor: "#212121",
		height: "100%",
		width: "100%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		border: `1px solid ${props.borderColor || "#424242"}`,
		borderRadius: "3px",
	}),
	actions: {
		top: -45,
		right: 0,
		position: "absolute",
		zIndex: -1,
		display: "flex",
		flexDirection: "row",
	},
	action: {
		padding: 10,
		marginLeft: 5,
		cursor: "pointer",
	},
	delete: {
		top: 0,
		right: 0,
		position: "absolute",
	},
	appLink: {
		color: "white",
	},
};

const widgetDetail = {
	autocomplete: {
		width: 300,
	},
};

const notifications = {
	root: {
		backgroundColor: "#212121",
		width: "100%",
		height: "100%",
	},
	header: {
		backgroundColor: "#424242",
		paddingLeft: 16,
		paddingRight: 8,
	},
	avatar: {
		color: "white",
		backgroundColor: "#444",
	},
	badge: {
		marginLeft: "25px",
	},
};

const reddit = {
	root: {
		backgroundColor: "#212121",
		width: "100%",
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
	media: props => ({
		position: props.inList ? "relative" : "absolute",
		top: "0",
		left: "0",
		display: "block",
		width: "100%",
		height: "100%",
		objectFit: "contain",
	}),
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
	subreddit: {
		top: "40px",
		left: "5px",
	},
	comments: {
		bottom: "35px",
		left: "5px",
	},
	score: {
		bottom: "5px",
		left: "5px",
	},
	date: {
		bottom: "5px",
		right: "5px",
	},
	textHeader: {
		padding: 16,
		boxSizing: "border-box",
		borderBottom: "1px solid #424242",
	},
	textContent: {
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
	widthFix: {
		width: "100%",
	},
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	expandedView: {
		height: "80%",
		width: "90%",
		outline: "none",
		"& img": {
			display: "block",
			objectFit: "contain",
			height: "100%",
			width: "100%",
		},
	},
	expandedBtn: {
		height: "100%",
		padding: "12px",
		color: "white",
		backgroundColor: "#3d3d3d",
		"&:hover": {
			backgroundColor: "#212121",
		},
	},
	header: {
		borderLeft: "1px solid #212121",
		borderRight: "1px solid #212121",
		"& i": {
			fontSize: "1.1rem",
		},
	},
	singleWrapper: {
		backgroundColor: "#212121",
		width: "100%",
		height: "100%",
	},
	singleHeader: {
		backgroundColor: "#424242",
		padding: "8px 16px",
	},
	singleContent: {
		overflow: "auto",
	},
	flairs: {
		"& div": {
			marginRight: 5,
			marginBottom: 5,
		},
	},
	gildedBadge: {
		padding: "0 2px",
		height: "15px",
		minWidth: "15px",
		fontSize: "0.6rem",
	},
};

const weather = {
	root: {
		display: "flex",
		flexDirection: "column",
		backgroundColor: "#212121dd",
		boxSizing: "border-box",
		width: "100%",
		height: "100%",
	},
	content: {
		padding: 16,
		paddingBottom: 0,
	},
	description: {
		textTransform: "capitalize",
	},
	info: {
		display: "flex",
		alignItems: "center",
		"& i": {
			fontSize: "1.5rem",
			marginRight: 4,
			marginBottom: 5,
			display: "inline-block",
		},
	},
	nextDays: {
		"& div": {
			borderTop: "1px solid #121212",
			borderRight: "1px solid #121212",
			padding: "5px 2px 5px 2px",
			"& img": {
				width: 40,
				height: 40,
			},
		},
	},
	lastDay: {
		borderRight: "none !important",
	},
};

const tv = {
	root: {
		flexGrow: 1,
		backgroundColor: "#212121",
		width: "100%",
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
};

const crypto = {
	root: {
		backgroundColor: "#212121",
		width: "100%",
		height: "100%",
		boxSizing: "border-box",
		overflow: "auto",
		padding: 10,
	},
	cell: {
		padding: 2,
	},
	nameCell: {
		maxWidth: 60,
	},
	listImage: {
		height: 32,
		width: 32,
		padding: 5,
	},
	singleRoot: {
		backgroundColor: "#212121",
		width: "100%",
		height: "100%",
		boxSizing: "border-box",
		padding: 16,
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
		marginRight: 10,
		height: 36,
		width: 36,
	},
	green: {
		color: "#43a047 !important",
	},
	red: {
		color: "#f4511e !important",
	},
};

const twitch = {
	root: {
		backgroundColor: "#212121",
		width: "100%",
		height: "100%",
	},
	imageWrapper: {
		width: "100px",
		position: "relative",
	},
};

export { widgets, widget, widgetDetail, notifications, reddit, weather, tv, crypto, twitch };
