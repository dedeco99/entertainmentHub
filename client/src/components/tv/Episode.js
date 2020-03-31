import React from "react";
import PropTypes from "prop-types";

import { formatDate } from "../../utils/utils";

import noimage from "../../img/noimage.png";

function Episode({ episode }) {
	const seasonLabel = episode.season > 9 ? `S${episode.season}` : `SO${episode.season}`;
	const episodeLabel = episode.number > 9 ? `E${episode.number}` : `EO${episode.number}`;
	const image = episode.image ? episode.image : noimage;

	return (
		<div>
			<img src={image} width="100%" alt="Preview" />
			{episode.title}
			<br />
			{formatDate(episode.date, "DD-MM-YYYY")}
			<br />
			{seasonLabel + episodeLabel}
			<br />
			{episode.seriesId.displayName ? episode.seriesId.displayName : ""}
		</div>
	);
}

Episode.propTypes = {
	episode: PropTypes.object,
};

export default Episode;
