import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";

import Episode from "./Episode";

const Episodes = ({ episodes }) => {
	let episodeList = <div className="col-12"><div align="center">No episodes</div></div>;
	if (episodes && episodes.length > 0) {
		episodeList = episodes.map(episode => {
			return (
				<Grid
					item xs={12} sm={6} md={6} lg={4} xl={3}
					key={`${episode.seriesId}${episode.season}${episode.number}`}
				>
					<Episode episode={episode} />
				</Grid>
			);
		});
	}

	return (
		<div className="tvseries-list">
			<Grid container spacing={2}>
				{episodeList}
			</Grid>
		</div>
	);
};

Episodes.propTypes = {
	episodes: PropTypes.array,
};

export default Episodes;
