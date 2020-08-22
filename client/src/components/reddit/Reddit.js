import React, { useState } from "react";

import { Grid, IconButton } from "@material-ui/core";

import FeedDetail from "../.partials/FeedDetail";
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
					<i className="icon-add" />
				</IconButton>
				<FeedDetail open={openModal} platform="reddit" onClose={handleCloseModal} />
			</Grid>
			<Grid item sm={9} md={10}>
				<Feeds platform="reddit" />
			</Grid>
		</Grid>
	);
}

export default Reddit;
