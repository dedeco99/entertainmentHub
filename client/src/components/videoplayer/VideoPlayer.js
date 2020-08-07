import React, { useContext, useState, useEffect } from "react";

import ReactPlayer from "react-player";
import { Rnd } from "react-rnd";

import {
	makeStyles,
	List,
	ListItem,
	Box,
	ListItemSecondaryAction,
	IconButton,
	Typography,
	Paper,
	Tooltip,
	Fab,
	Badge,
} from "@material-ui/core";

import { VideoPlayerContext } from "../../contexts/VideoPlayerContext";

import { videoPlayer as styles } from "../../styles/VideoPlayer";

const useStyles = makeStyles(styles);

const restrictions = {
	minHeight: 300,
	minWidth: 600,
	//maxHeight: ,
	//maxWidth: ,
};

function VideoPlayer() {
	const classes = useStyles();
	const { state, dispatch } = useContext(VideoPlayerContext);
	const { videos, x, y, width, height } = state;
	const [minimized, setMinimized] = useState(true);
	const [currentVideo, setCurrentVideo] = useState(videos[0]);

	function handleRemoveVideo(video) {
		dispatch({ type: "REMOVE_VIDEO", video });
	}

	function handleChangePosition(e, d) {
		dispatch({ type: "CHANGE_POSITION", position: { x: d.x, y: d.y } });
	}

	function handleResize(e, direction, ref, delta, position) {
		dispatch({ type: "CHANGE_POSITION", position });
		dispatch({ type: "CHANGE_DIMENSIONS", dimensions: { height: ref.style.height, width: ref.style.width } });
	}

	useEffect(() => {
		if (!currentVideo || !videos.includes(currentVideo)) {
			setCurrentVideo(videos[0]);
		}
		if (minimized && videos.length === 1) {
			setMinimized(false);
		}
	}, [state]); // eslint-disable-line

	if (currentVideo && videos.length) {
		if (minimized) {
			return (
				<Box position="fixed" bottom="15px" right="15px">
					<Tooltip title="Video player">
						<Badge badgeContent={videos.length} overlap="circle" color="error">
							<Fab size="medium" onClick={() => setMinimized(false)}>
								<span className="material-icons"> {"video_library"} </span>
							</Fab>
						</Badge>
					</Tooltip>
				</Box>
			);
		}
		return (
			<Rnd
				style={{ position: "fixed" }}
				size={{ width, height }}
				position={{
					x: x || document.documentElement.clientWidth - width - 15,
					y: y || document.documentElement.clientHeight - height - 15,
				}}
				onDragStop={handleChangePosition}
				onResizeStop={handleResize}
				{...restrictions}
				//bounds="parent"
			>
				<Paper square variant="outlined" component={Box} height="100%">
					<Box display="flex" height="100%" width="100%">
						<Box flexGrow={1}>
							<ReactPlayer
								playing
								controls
								url={currentVideo.url}
								height="100%"
								width="100%"
								onEnded={() => handleRemoveVideo(currentVideo)}
							/>
						</Box>
						<Box display="flex" flexDirection="column" height="100%" width="200px" className={classes.sidebar}>
							<Box display="flex" alignItems="center" p={1}>
								<Typography component={Box} flexGrow={1}> {`${videos.length} videos in queue`} </Typography>
								<IconButton size="small" aria-label="delete" onClick={() => setMinimized(true)}>
									<span>
										{"─"}
									</span>
								</IconButton>
							</Box>
							<Box flexGrow={1} overflow="auto">
								<List disablePadding>
									{videos.map(v => (
										<ListItem
											button
											divider
											key={v.url}
											onClick={() => setCurrentVideo(v)}
											selected={currentVideo.url === v.url}
										>
											<Box display="flex" flexDirection="column" flex="1 1 auto" minWidth={0}>
												<Typography variant="body1" title={v.name} noWrap>
													{v.name}
												</Typography>
												<Typography variant="caption" title={v.channelName} noWrap>
													{v.channelName}
												</Typography>
											</Box>
											<ListItemSecondaryAction>
												<IconButton edge="end" aria-label="delete" onClick={() => handleRemoveVideo(v)}>
													<i className="material-icons"> {"delete"} </i>
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
									))}
								</List>
							</Box>
						</Box>
					</Box>
				</Paper>
			</Rnd>
		);
	}
	return null;
}

export default VideoPlayer;
