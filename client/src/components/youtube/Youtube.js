import React, { useState } from "react";

import { Grid, IconButton } from "@material-ui/core";

import Follows from "../.partials/Follows";
import Subscriptions from "../.partials/Subscriptions";
import FeedDetail from "../.partials/FeedDetail";
import Feeds from "../.partials/Feeds";

function Youtube() {
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
				<Follows platform="youtube" />
				<Subscriptions platform="youtube" />
				<IconButton onClick={handleOpenModal}>
					<i className="icofont-ui-add" />
				</IconButton>
				<FeedDetail open={openModal} platform="youtube" onClose={handleCloseModal} />
			</Grid>
			<Grid item sm={9} md={10}>
				<Feeds platform="youtube" />
			</Grid>
		</Grid>
	);
}

export default Youtube;
