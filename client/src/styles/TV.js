const tv = {
	searchBtn: {
		width: "100% !important",
	},
	outlinedBtn: {
		marginTop: 10,
		marginBottom: 10,
	},
};

const episodes = {
	episodeBtn: {
		height: "40px",
		marginBottom: 10,
	},
	noEpisodes: {
		textAlign: "center",
	},
};

const episode = {
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
		whiteSpace: "nowrap",
		overflow: "hidden",
		maxWidth: "95%",
	},
	seriesName: {
		top: "30px",
		left: "5px",
		whiteSpace: "nowrap",
		overflow: "hidden",
		maxWidth: "95%",
	},
	seriesNameClickable: {
		"&:hover": {
			color: "black",
			backgroundColor: "white",
		},
	},
	date: {
		bottom: "5px",
		right: "5px",
	},
	season: {
		bottom: "5px",
		left: "5px",
	},
	finale: {
		bottom: "30px",
		left: "5px",
	},
};

const banners = {
	addSeriesContainer: {
		position: "relative",
		display: "inline-block",
		textAlign: "center",
	},
	addSeriesIcon: {
		position: "absolute",
		bottom: "50%",
		right: "50%",
		margin: "0px -25px -15px 0px",
		cursor: "pointer",
	},
	checkboxSize: {
		padding: "5px",
	},
};

export { tv, episodes, episode, banners };
