import { makeStyles } from "@material-ui/styles";

const tv = () => ({
	searchBtn: {
		width: "100% !important",
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

const banners = makeStyles({
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
});

export {
	tv,
	episodes,
	episode,
	banners,
};
