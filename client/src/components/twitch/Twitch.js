import React from "react";

import { Grid } from "@material-ui/core";

import Follows from "../.partials/Follows";
import Subscriptions from "../.partials/Subscriptions";

function Twitch() {
	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={2} md={4}>
				<Follows platform="twitch" />
				<Subscriptions platform="twitch" />
			</Grid>
			<Grid item xs={12} sm={10} md={8} />
		</Grid>
	);
}

export default Twitch;
