import React from "react";

import { Grid } from "@material-ui/core";

import Follows from "../.partials/Follows";
import Subscriptions from "../.partials/Subscriptions";

function Twitch() {
	return (
		<Grid container spacing={2}>
			<Grid item sm={3} md={2}>
				<Follows platform="twitch" />
				<Subscriptions platform="twitch" />
			</Grid>
			<Grid item sm={9} md={10} lg={10} />
		</Grid>
	);
}

export default Twitch;
