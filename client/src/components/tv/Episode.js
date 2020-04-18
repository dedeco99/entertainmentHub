import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";

import { formatDate } from "../../utils/utils";

import noimage from "../../img/noimage.png";

import { episode as styles } from "../../styles/TV";

function Episode({ episode, classes }) {
	const seasonLabel = episode.season > 9 ? `S${episode.season}` : `S0${episode.season}`;
	const episodeLabel = episode.number > 9 ? `E${episode.number}` : `E0${episode.number}`;
	const image = episode.image ? episode.image : noimage;

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
	classes: PropTypes.object.isRequired,
	episode: PropTypes.object.isRequired,
};

export default withStyles(styles)(Episode);
