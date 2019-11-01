import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";

import Episode from "./Episode";

import loading from "../../img/loading2.gif";

function Episodes({ episodes }) {
	let episodeList = <div className="loading" align="center"><img src={loading} alt="Loading..." /></div>;
	if (episodes && episodes.length > 0) {
		episodeList = episodes.map(episode => (
			<Grid
				item xs={12} sm={6} md={6} lg={4} xl={3}
				key={`${episode.seriesId.seriesId}-${episode.season}-${episode.number}`}
			>
				<Episode episode={episode} />
			</Grid>
		));
	}

	return (
		<Grid container spacing={2}>
			{episodeList}
		</Grid>
	);
}

Episodes.propTypes = {
	episodes: PropTypes.array,
};

export default Episodes;
