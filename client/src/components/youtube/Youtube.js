import React, { useState } from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

import Subscriptions from "../.partials/Subscriptions";
import Channels from "../.partials/Channels";
import ChannelGroupDetail from "../.partials/ChannelGroupDetail";
import Feeds from "../.partials/Feeds";

function Youtube({ history }) {
	const [openModal, setOpenModal] = useState(false);

	function handleOpenModal() {
		setOpenModal(true);
	}

	function handleCloseModal() {
		setOpenModal(false);
	}

	return (
		<Grid container spacing={2}>
			<Grid item sm={3} md={2}>
				<Subscriptions history={history} platform="youtube" />
				<Channels platform="youtube" />
				<IconButton onClick={handleOpenModal}>
					<i className="icofont-ui-add" />
				</IconButton>
				<ChannelGroupDetail open={openModal} platform="youtube" onClose={handleCloseModal} />
			</Grid>
			<Grid item sm={9} md={10}>
				<Feeds platform="youtube" />
			</Grid>
		</Grid>
	);
}

Youtube.propTypes = {
	history: PropTypes.object.isRequired,
};

export default Youtube;
