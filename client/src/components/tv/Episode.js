import React from "react";
import PropTypes from "prop-types";

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
			{episode.date}
			<br />
			{seasonLabel + episodeLabel}
		</div>
	);
}

Episode.propTypes = {
	episode: PropTypes.object,
};

export default Episode;