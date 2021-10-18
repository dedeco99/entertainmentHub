import React from "react";
import PropTypes from "prop-types";

import { Box, CircularProgress } from "@material-ui/core";

function Loading({ size }) {
	return (
		<Box key={0} display="flex" alignItems="center" justifyContent="center">
			<CircularProgress size={size} />
		</Box>
	);
}

Loading.propTypes = {
	size: PropTypes.number,
};

export default Loading;
