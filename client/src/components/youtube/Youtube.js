import React from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";

import Subscriptions from "../.partials/Subscriptions";
import Channels from "../.partials/Channels";
import ChannelGroupDetail from "./ChannelGroupDetail";
import Feeds from "./Feeds";

function Youtube({ history }) {
	return (
		<Grid container spacing={2}>
			<Grid item sm={3} md={2}>
				<Subscriptions history={history} platform="youtube" />
				<Channels platform="youtube" />
				<ChannelGroupDetail />
			</Grid>
			<Grid item sm={9} md={10}>
				<Feeds />
			</Grid>
		</Grid>
	);
}

Youtube.propTypes = {
	history: PropTypes.object.isRequired,
};

export default Youtube;
