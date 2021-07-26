import React, { useState, useContext } from "react";
import PropTypes from "prop-types";

import { makeStyles, Card, CardMedia, CardActionArea } from "@material-ui/core";

import { UserContext } from "../../contexts/UserContext";
import { TVContext } from "../../contexts/TVContext";

import { patchSubscription } from "../../api/subscriptions";

import { formatDate } from "../../utils/utils";

import { episode as styles } from "../../styles/TV";

import placeholder from "../../img/noimage.png";

const useStyles = makeStyles(styles);

function Episode({ episode }) {
	const classes = useStyles();
	const { user } = useContext(UserContext);
	const { dispatch } = useContext(TVContext);
	const [rerender, setRerender] = useState(true);

	async function markAsWatched() {
		const response = await patchSubscription(episode.series._id, !episode.watched, [
			`S${episode.season}E${episode.number}`,
		]);

		if (response.status === 200) {
			episode.watched = Boolean(response.data.watched.find(w => w.key === `S${episode.season}E${episode.number}`));

			dispatch({
				type: "EDIT_EPISODES_TO_WATCH",
				subscription: response.data,
				increment: episode.watched ? -1 : 1,
			});

			setRerender(!rerender);
		}
	}

	const seasonLabel = episode.season > 9 ? `S${episode.season}` : `S0${episode.season}`;
	const episodeLabel = episode.number > 9 ? `E${episode.number}` : `E0${episode.number}`;
	const image = episode.image ? episode.image : placeholder;

	return (
		<Card className={classes.root}>
			<CardActionArea onClick={markAsWatched}>
				<CardMedia
					component="img"
					height="150"
					image={image}
					style={
						user.settings.tv && user.settings.tv.hideEpisodesThumbnails
							? { filter: "blur(30px)" }
							: { filter: "blur(0px)" }
					}
				/>
				<div className={`${classes.overlay} ${classes.title}`} title={episode.title}>
					{episode.title}
				</div>
				<div className={episode.series ? `${classes.overlay} ${classes.seriesName}` : ""}>
					{episode.series && episode.series.displayName}
				</div>
				<div className={episode.finale ? `${classes.overlay} ${classes.finale}` : ""}>
					{episode.finale && "Finale"}
				</div>
				<div className={`${classes.overlay} ${classes.season}`}>
					{seasonLabel + episodeLabel}
					{episode.watched ? (
						<i
							className="icon-check-circled"
							style={{ color: "green", top: "1px", marginLeft: "3px", position: "relative" }}
						/>
					) : null}
				</div>
				<div className={`${classes.overlay} ${classes.date}`}>{formatDate(episode.date, "DD-MM-YYYY")}</div>
			</CardActionArea>
		</Card>
	);
}

Episode.propTypes = {
	episode: PropTypes.object.isRequired,
};

export default Episode;
