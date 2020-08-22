import React, { useState } from "react";

import { makeStyles, Grid } from "@material-ui/core";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab";

import Follows from "../.partials/Follows";
import Subscriptions from "../.partials/Subscriptions";
import FeedDetail from "../.partials/FeedDetail";
import Feeds from "../.partials/Feeds";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Youtube() {
	const classes = useStyles();
	const [openOptions, setOpenOptions] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [openFollows, setOpenFollows] = useState(false);

	function handleOpenOptions() {
		setOpenOptions(true);
	}

	function handleCloseOptions() {
		setOpenOptions(false);
	}

	function handleOpenModal() {
		setOpenModal(true);
	}

	function handleCloseModal() {
		setOpenModal(false);
	}

	function handleOpenFollows() {
		setOpenFollows(true);
	}

	function handleCloseFollows() {
		setOpenFollows(false);
	}

	const actions = [
		{ name: "Add Subscriptions", icon: <i className="icofont-users-social" />, handleClick: handleOpenFollows },
		{ name: "Add Feed", icon: <i className="icofont-listine-dots" />, handleClick: handleOpenModal },
	];

	return (
		<Grid container spacing={2}>
			<Grid item sm={3} md={2}>
				<Subscriptions platform="youtube" />
				<Follows open={openFollows} platform="youtube" onClose={handleCloseFollows} />
				<FeedDetail open={openModal} platform="youtube" onClose={handleCloseModal} />
			</Grid>
			<Grid item sm={9} md={10}>
				<Feeds platform="youtube" />
			</Grid>
			<SpeedDial
				ariaLabel="Options"
				icon={<SpeedDialIcon />}
				onClose={handleCloseOptions}
				onOpen={handleOpenOptions}
				open={openOptions}
				className={classes.speedDial}
				FabProps={{ size: "medium" }}
			>
				{actions.map(action => (
					<SpeedDialAction
						key={action.name}
						icon={action.icon}
						tooltipTitle={action.name}
						onClick={action.handleClick}
					/>
				))}
			</SpeedDial>
		</Grid>
	);
}

export default Youtube;
