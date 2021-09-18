import React, { useContext } from "react";
import PropTypes from "prop-types";

import { makeStyles, Card, CardMedia, CardActionArea } from "@material-ui/core";

import Placeholder from "../.partials/Placeholder";

import { UserContext } from "../../contexts/UserContext";
import { TVContext } from "../../contexts/TVContext";

import { patchSubscription } from "../../api/subscriptions";

import { formatDate } from "../../utils/utils";

import { episode as styles } from "../../styles/TV";

const useStyles = makeStyles(styles);

function Episode({ episode, height }) {
	const classes = useStyles();
	const { user } = useContext(UserContext);
	const { dispatch } = useContext(TVContext);

	async function markAsWatched() {
		const response = await patchSubscription(episode.series._id, {
			markAsWatched: !episode.watched,
			watched: [`S${episode.season}E${episode.number}`],
		});

		if (response.status === 200) {
			episode.watched = Boolean(response.data.watched.find(w => w.key === `S${episode.season}E${episode.number}`));

			dispatch({
				type: "EDIT_EPISODES_TO_WATCH",
				subscription: response.data,
				increment: episode.watched ? -1 : 1,
			});
		}
	}

	const seasonLabel = episode.season > 9 ? `S${episode.season}` : `S0${episode.season}`;
	const episodeLabel = episode.number > 9 ? `E${episode.number}` : `E0${episode.number}`;

	return (
		<Card className={classes.root}>
			<CardActionArea
				onClick={markAsWatched}
				style={episode.watched ? { border: "3px solid #32CD32" } : { border: "3px solid transparent" }}
			>
				{episode.image ? (
					<CardMedia
						component="img"
						height={height ? height : "150"}
						image={height ? episode.image.replace("w454_and_h254_bestv2", "original") : episode.image}
						style={
							user.settings.tv && user.settings.tv.hideEpisodesThumbnails && !episode.watched
								? { filter: "blur(30px)" }
								: { filter: "blur(0px)" }
						}
					/>
				) : (
					<Placeholder height={150} />
				)}
				<div className={`${classes.overlay} ${classes.title}`} title={episode.title}>
					{episode.title}
				</div>
				<div className={episode.series ? `${classes.overlay} ${classes.seriesName}` : ""}>
					{episode.series && episode.series.displayName}
				</div>
				<div className={episode.finale ? `${classes.overlay} ${classes.finale}` : ""}>
					{episode.finale && "Finale"}
				</div>
				<div className={`${classes.overlay} ${classes.season}`}>{seasonLabel + episodeLabel}</div>
				<div className={`${classes.overlay} ${classes.date}`}>{formatDate(episode.date, "DD-MM-YYYY")}</div>
			</CardActionArea>
		</Card>
	);
}

Episode.propTypes = {
	episode: PropTypes.object.isRequired,
	height: PropTypes.string,
};

export default Episode;
