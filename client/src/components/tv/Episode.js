import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";

import { formatDate } from "../../utils/utils";

import noimage from "../../img/noimage.png";

const useStyles = makeStyles({
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

function Episode({ episode }) {
	const seasonLabel = episode.season > 9 ? `S${episode.season}` : `S0${episode.season}`;
	const episodeLabel = episode.number > 9 ? `E${episode.number}` : `E0${episode.number}`;
	const image = episode.image ? episode.image : noimage;

	const classes = useStyles();

	return (
		<Card className={classes.root}>
			<CardActionArea>
				<CardMedia component="img" height="150" image={image} />
				<div className={`${classes.overlay} ${classes.title}`}>
					{episode.title}
				</div>
				<div className={`${classes.overlay} ${classes.seriesName}`}>
					{episode.seriesId.displayName}
				</div>
				<div className={`${classes.overlay} ${classes.season}`}>
					{seasonLabel + episodeLabel}
				</div>
				<div className={`${classes.overlay} ${classes.date}`}>
					{formatDate(episode.date, "DD-MM-YYYY")}
				</div>
			</CardActionArea>
		</Card>
	);
}

Episode.propTypes = {
	episode: PropTypes.object,
};

export default Episode;
