import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";

import Subscriptions from "../.partials/Subscriptions";
import Channels from "../.partials/Channels";

function Twitch({ history }) {
	return (
		<Grid container spacing={2}>
			<Grid item sm={3} md={2}>
				<Subscriptions history={history} platform="twitch" />
				<Channels platform="twitch" />
			</Grid>
			<Grid item sm={9} md={10} lg={10} />
		</Grid>
	);
}

Twitch.propTypes = {
	history: PropTypes.object.isRequired,
};

export default Twitch;
