import React from "react";

import { Box, CircularProgress } from "@material-ui/core";

function Loading() {
	return (
		<Box key={0} display="flex" alignItems="center" justifyContent="center">
			<CircularProgress />
		</Box>
	);
}

export default Loading;
