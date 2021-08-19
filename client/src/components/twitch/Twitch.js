import React, { useContext, useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import ReactPlayer from "react-player";

import { makeStyles, Grid } from "@material-ui/core";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";

import Follows from "../.partials/Follows";
import Subscriptions from "../.partials/Subscriptions";
import Videos from "../youtube/Videos";

import { TwitchContext } from "../../contexts/TwitchContext";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Twitch() {
	const classes = useStyles();
	const history = useHistory();
	const match = useRouteMatch();
	const { state } = useContext(TwitchContext);
	const { subscriptions } = state;
	const [openOptions, setOpenOptions] = useState(false);
	const [openFollows, setOpenFollows] = useState(false);
	const [activeSubscription, setActiveSubscription] = useState(false);

	useEffect(() => {
		const subscription = subscriptions.find(s => s.externalId === match.params.channel);

		if (subscription) setActiveSubscription(subscription);
	}, [subscriptions, match.url]);

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

	function handleShowVideos(id) {
		if (match.params.channel !== id) {
			history.push(`/twitch/${id}`);
		}
	}

	const actions = [
		{
			name: "Add Subscriptions",
			icon: <i className="icon-user" />,
			handleClick: handleOpenFollows,
		},
	];

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={2} md={4}>
				<Follows open={openFollows} platform="twitch" onClose={handleCloseFollows} />
				<Subscriptions
					platform="twitch"
					selected={match.params.channel}
					idField="externalId"
					action={handleShowVideos}
				/>
			</Grid>
			<Grid item xs={12} sm={10} md={8}>
				{match.params.channel && (
					<>
						{activeSubscription && (
							<ReactPlayer
								controls
								url={`https://www.twitch.tv/${activeSubscription.displayName}`}
								height="400px"
								width="100%"
							/>
						)}
						<br />
						<Videos platform="twitch" />
					</>
				)}
			</Grid>
			<SpeedDial
				ariaLabel="Options"
				icon={<i className="icon-add" />}
				onClose={handleCloseOptions}
				onOpen={handleOpenOptions}
				open={openOptions}
				className={classes.speedDial}
				FabProps={{ size: "small" }}
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

export default Twitch;
