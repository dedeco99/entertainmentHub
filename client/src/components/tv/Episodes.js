import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";

import Episode from "./Episode";

function Episodes({ episodes }) {
	let episodeList = null;
	if (episodes && episodes.length > 0) {
		episodeList = episodes.map(episode => (
			<Grid
				item xs={12} sm={6} md={4} lg={3} xl={2}
				key={episode._id}
			>
				<Episode episode={episode} />
			</Grid>
		));
	} else {
		episodeList = (
			<Grid
				item xs={12}
				key={1}
			>
				<div style={{ textAlign: "center" }}>{"No episodes"}</div>
			</Grid>
		);
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
