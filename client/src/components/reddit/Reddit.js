import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

import ChannelGroupDetail from "../.partials/ChannelGroupDetail";
import Feeds from "../.partials/Feeds";

function Reddit() {
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
				<IconButton onClick={handleOpenModal}>
					<i className="icofont-ui-add" />
				</IconButton>
				<ChannelGroupDetail open={openModal} platform="reddit" onClose={handleCloseModal} />
			</Grid>
			<Grid item sm={9} md={10}>
				<Feeds platform="reddit" />
			</Grid>
		</Grid>
	);
}

export default Reddit;
