import React from "react";

import { Grid } from "@material-ui/core";

import Subscriptions from "../.partials/Subscriptions";
import Channels from "../.partials/Channels";

function Twitch() {
	return (
		<Grid container spacing={2}>
			<Grid item sm={3} md={2}>
				<Subscriptions platform="twitch" />
				<Channels platform="twitch" />
			</Grid>
			<Grid item sm={9} md={10} lg={10} />
		</Grid>
	);
}

export default Twitch;
