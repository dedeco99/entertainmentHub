import React, { useContext, useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import ReactPlayer from "react-player";

import { Grid, Box } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";

import Follows from "../.partials/Follows";
import Subscriptions from "../.partials/Subscriptions";
import Videos from "../youtube/Videos";

import { TwitchContext } from "../../contexts/TwitchContext";
import { ActionContext } from "../../contexts/ActionContext";

function Twitch() {
	const history = useHistory();
	const match = useRouteMatch();
	const { state } = useContext(TwitchContext);
	const { subscriptions } = state;
	const { dispatch } = useContext(ActionContext);
	const [openFollows, setOpenFollows] = useState(false);
	const [activeSubscription, setActiveSubscription] = useState(false);
	const [type, setType] = useState("videos");

	useEffect(() => {
		if (!match.params.channel && subscriptions.length) {
			history.replace(`/twitch/${subscriptions[0].externalId}`);
		}
	}, []);

	useEffect(() => {
		const subscription = subscriptions.find(s => s.externalId === match.params.channel);

		if (subscription) setActiveSubscription(subscription);
	}, [subscriptions, match.url]);

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

	function handleChangeType(e, value) {
		if (value && value !== type) setType(value);
	}

	useEffect(() => {
		const actions = [
			{
				from: "twitch",
				name: "Add Subscriptions",
				icon: <i className="icon-user" />,
				handleClick: handleOpenFollows,
			},
		];

		function setupActions() {
			dispatch({ type: "ADD_ACTIONS", actions });
		}

		setupActions();

		return () => dispatch({ type: "DELETE_ACTIONS", from: "twitch" });
	}, []);

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={2} md={3} lg={2}>
				<Follows open={openFollows} platform="twitch" onClose={handleCloseFollows} />
				<Subscriptions
					platform="twitch"
					selected={match.params.channel}
					idField="externalId"
					action={handleShowVideos}
				/>
			</Grid>
			<Grid item xs={12} sm={10} md={9} lg={10}>
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
						<Box align="center" m={2}>
							<ToggleButtonGroup value={type} onChange={handleChangeType} color="primary" exclusive>
								<ToggleButton value="videos" color="primary" variant="outlined">
									{"Videos"}
								</ToggleButton>
								<ToggleButton value="clips" color="primary" variant="outlined">
									{"Clips"}
								</ToggleButton>
							</ToggleButtonGroup>
						</Box>
						<Videos platform="twitch" type={type} />
					</>
				)}
			</Grid>
		</Grid>
	);
}

export default Twitch;
