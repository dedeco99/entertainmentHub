import React, { useEffect } from "react";

import Grid from "@material-ui/core/Grid";

import { getSubreddits } from "../../api/reddit";

function Reddit() {
	useEffect(() => {
		getSubreddits();
	}, []);

	return (
		<Grid container spacing={2}>
			{"Reddit"}
		</Grid>
	);
}

export default Reddit;
