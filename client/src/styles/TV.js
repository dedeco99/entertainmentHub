const tv = () => ({
	searchBtn: {
		width: "100% !important",
		backgroundColor: "#222",
	},
	outlinedBtn: {
		marginTop: 10,
		marginBottom: 10,
	},
});

const episodes = () => ({
	episodeListContainer: {
		width: "100%",
	},
	episodeBtn: {
		marginTop: 10,
		marginBottom: 10,
	},
	noEpisodes: {
		textAlign: "center",
	},
});

const episode = () => ({
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
	},
	seriesName: {
		top: "30px",
		left: "5px",
	},
	date: {
		bottom: "5px",
		right: "5px",
	},
	season: {
		bottom: "5px",
		left: "5px",
	},
});


export {
	tv,
	episodes,
	episode,
};
