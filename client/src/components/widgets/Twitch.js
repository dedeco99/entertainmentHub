import React, { useState, useEffect, useContext } from "react";

import { makeStyles, Zoom, List, ListItem, Box, Typography } from "@material-ui/core";

import Loading from "../.partials/Loading";

import { VideoPlayerContext } from "../../contexts/VideoPlayerContext";

import { getStreams } from "../../api/twitch";

import { formatNumber } from "../../utils/utils";

import { twitch as twitchStyles } from "../../styles/Widgets";
import generalStyles from "../../styles/General";

const useStyles = makeStyles({ ...twitchStyles, ...generalStyles });

function Twitch() {
	const classes = useStyles();
	const [streams, setStreams] = useState([]);
	const [open, setOpen] = useState(false);
	const videoPlayer = useContext(VideoPlayerContext);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			const response = await getStreams();

			if (response.status === 200 && isMounted) {
				setStreams(response.data);
				setOpen(true);
			}
		}

		fetchData();

		return () => (isMounted = false);
	}, []);

	function handleAddToVideoPlayer(videoSource, stream) {
		videoPlayer.dispatch({
			type: "ADD_VIDEO",
			videoSource,
			video: {
				name: stream.title,
				thumbnail: stream.thumbnail,
				url: `https://www.twitch.tv/${stream.user}`,
				channelName: stream.user,
			},
		});
	}

	if (!open) return <Loading />;

	return (
		<Zoom in={open}>
			<Box className={classes.root}>
				<List>
					{streams.map(stream => (
						<ListItem key={stream.id} button divider onClick={() => handleAddToVideoPlayer("twitch", stream)}>
							<Box className={classes.imageWrapper}>
								<img alt={`${stream.user}-preview`} src={stream.thumbnail} width="100%" />
								<Typography variant="caption" className={classes.bottomRightOverlay}>
									{formatNumber(stream.viewers)}
								</Typography>
							</Box>
							<Box p={1} flex="1" flexGrow={2} minWidth="0%">
								<Typography variant="body1" noWrap>
									{stream.user}
								</Typography>
								<Typography variant="body2" noWrap>
									{stream.title}
								</Typography>
								<Typography variant="subtitle2" noWrap>
									{stream.game}
								</Typography>
							</Box>
						</ListItem>
					))}
				</List>
			</Box>
		</Zoom>
	);
}

export default Twitch;
