import React from "react";
import PropTypes from "prop-types";

import { Box, Typography } from "@material-ui/core";

function Placeholder({ height }) {
	return (
		<Box display="flex" alignItems="center" justifyContent="center" height={height}>
			<Typography variant="body1" style={{ color: "#ccc", fontSize: "2em" }}>
				{"No Image Available"}
			</Typography>
		</Box>
	);
}

Placeholder.propTypes = {
	height: PropTypes.number,
};

export default Placeholder;
