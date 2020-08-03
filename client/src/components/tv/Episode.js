import React from "react";
import PropTypes from "prop-types";

import { makeStyles, Card, CardMedia, CardActionArea } from "@material-ui/core";

import { formatDate } from "../../utils/utils";

import { episode as styles } from "../../styles/TV";

import placeholder from "../../img/noimage.png";

const useStyles = makeStyles(styles);

function Episode({ episode }) {
	const classes = useStyles();

	const seasonLabel = episode.season > 9 ? `S${episode.season}` : `S0${episode.season}`;
	const episodeLabel = episode.number > 9 ? `E${episode.number}` : `E0${episode.number}`;
	const image = episode.image ? episode.image : placeholder;

	return (
		<Card className={classes.root}>
			<CardActionArea>
				<CardMedia component="img" height="150" image={image} />
				<div className={`${classes.overlay} ${classes.title}`}>{episode.title}</div>
				<div className={episode.series && `${classes.overlay} ${classes.seriesName}`}>
					{episode.series && episode.series.displayName}
				</div>
				<div className={`${classes.overlay} ${classes.season}`}>{seasonLabel + episodeLabel}</div>
				<div className={`${classes.overlay} ${classes.date}`}>{formatDate(episode.date, "DD-MM-YYYY")}</div>
			</CardActionArea>
		</Card>
	);
}

Episode.propTypes = {
	episode: PropTypes.object.isRequired,
};

export default Episode;
