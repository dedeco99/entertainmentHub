import React, { useState } from "react";

import { makeStyles, Grid } from "@material-ui/core";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";

import Follows from "../.partials/Follows";
import Subscriptions from "../.partials/Subscriptions";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Twitch() {
	const classes = useStyles();
	const [openOptions, setOpenOptions] = useState(false);
	const [openFollows, setOpenFollows] = useState(false);

	function handleOpenOptions() {
		setOpenOptions(true);
	}

	function handleCloseOptions() {
		setOpenOptions(false);
	}

	function handleOpenFollows() {
		setOpenFollows(true);
	}

	function handleCloseFollows() {
		setOpenFollows(false);
	}

	const actions = [
		{ name: "Add Subscriptions", icon: <i className="icon-user" />, handleClick: handleOpenFollows },
	];

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={2} md={4}>
				<Follows open={openFollows} platform="twitch" onClose={handleCloseFollows} />
				<Subscriptions platform="twitch" />
			</Grid>
			<Grid item xs={12} sm={10} md={8} />
			<SpeedDial
				ariaLabel="Options"
				icon={<i className="icon-add" />}
				onClose={handleCloseOptions}
				onOpen={handleOpenOptions}
				open={openOptions}
				className={classes.speedDial}
				FabProps={{ size: "medium" }}
				direction="right"
			>
				{actions.map(action => (
					<SpeedDialAction
						key={action.name}
						icon={action.icon}
						tooltipTitle={action.name}
						tooltipPlacement="top"
						onClick={action.handleClick}
					/>
				))}
			</SpeedDial>
		</Grid>
	);
}

export default Twitch;
