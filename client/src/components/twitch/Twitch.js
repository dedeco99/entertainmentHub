import React, { useContext, useState, useEffect } from "react";

import { makeStyles, Grid } from "@material-ui/core";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";

import Follows from "../.partials/Follows";
import Subscriptions from "../.partials/Subscriptions";

import { VideoPlayerContext } from "../../contexts/VideoPlayerContext";

import { getClips } from "../../api/twitch";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Twitch() {
	const classes = useStyles();
	const videoPlayer = useContext(VideoPlayerContext);
	const [openOptions, setOpenOptions] = useState(false);
	const [openFollows, setOpenFollows] = useState(false);
	const [clips, setClips] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const response = await getClips("31239503");

			if (response.status === 200) {
				setClips(response.data);
			}
		}

		fetchData();
	}, []);

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
		{
			name: "Add Subscriptions",
			icon: <i className="icon-user" />,
			handleClick: handleOpenFollows,
		},
	];

	function handleAddToVideoPlayer(stream) {
		videoPlayer.dispatch({
			type: "ADD_VIDEO",
			videoSource: "twitch",
			video: {
				name: stream.displayName,
				thumbnail: stream.image,
				url: `https://www.twitch.tv/${stream.displayName}`,
				channelName: stream.displayName,
			},
		});
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={2} md={4}>
				<Follows open={openFollows} platform="twitch" onClose={handleCloseFollows} />
				<Subscriptions platform="twitch" action={handleAddToVideoPlayer} />
			</Grid>
			<Grid item xs={12} sm={10} md={8}>
				<Grid container spacing={2}>
					{clips.map(clip => (
						<Grid item key={clip.id} xs={12} lg={6} xl={4}>
							<iframe src={`${clip.url}&parent=localhost`} height="400px" width="100%" allowFullScreen />
						</Grid>
					))}
				</Grid>
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
