import React, { useContext, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Rnd } from "react-rnd";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";

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

function VideoPlayer() {
	const classes = useStyles();
	const { state, dispatch } = useContext(VideoPlayerContext);
	const { videos, x, y, width, height, minimized } = state;
	const [currentVideo, setCurrentVideo] = useState(videos[0]);
	const [restrictions, setRestrictions] = useState({
		minWidth: 600,
		minHeight: 300,
		maxWidth: document.documentElement.clientWidth - 20,
		maxHeight: document.documentElement.clientHeight - 80,
	});

	useEffect(() => {
		fromEvent(window, "resize")
			.pipe(debounceTime(250))
			.subscribe(() => {
				setRestrictions({
					...restrictions,
					maxWidth: document.documentElement.clientWidth - 20,
					maxHeight: document.documentElement.clientHeight - 80,
				});
			});
	}, []);

	function handleDeleteVideo(video) {
		dispatch({ type: "DELETE_VIDEO", video });
	}

	function handleChangePosition(e, d) {
		dispatch({ type: "SET_POSITION", position: { x: d.x, y: d.y } });
	}

	function handleResize(e, direction, ref, delta, position) {
		dispatch({ type: "SET_POSITION", position });
		dispatch({
			type: "SET_DIMENSIONS",
			dimensions: {
				height: Number(ref.style.height.replace("px", "")),
				width: Number(ref.style.width.replace("px", "")),
			},
		});
	}

	function calculateX() {
		const minX = 10;
		const maxX = document.documentElement.clientWidth - width - 10;

		if (x < minX) return minX;
		if (x > maxX) return maxX;
		return x;
	}

	function calculateY() {
		const minY = 75;
		const maxY = document.documentElement.clientHeight - height - 10;

		if (y < minY) return minY;
		if (y > maxY) return maxY;
		return y;
	}

	function handleMinimize() {
		dispatch({ type: "SET_MINIMIZED", minimized: true });
	}

	function handleMaximize() {
		dispatch({ type: "SET_MINIMIZED", minimized: false });
	}

	useEffect(() => {
		if (!currentVideo || !videos.includes(currentVideo)) {
			setCurrentVideo(videos[0]);
		}
		if (minimized && videos.length === 1) {
			handleMaximize();
		}
	}, [state]); // eslint-disable-line

	if (!currentVideo || !videos.length) return null;

	if (minimized) {
		return (
			<Box position="fixed" bottom="15px" right="15px">
				<Tooltip title="Video player">
					<Badge badgeContent={videos.length} overlap="circle" color="error">
						<Fab size="medium" onClick={handleMaximize}>
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
				x: calculateX(),
				y: calculateY(),
			}}
			onDragStop={handleChangePosition}
			onResizeStop={handleResize}
			{...restrictions}
			// bounds="parent"
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
							onEnded={() => handleDeleteVideo(currentVideo)}
						/>
					</Box>
					<Box display="flex" flexDirection="column" height="100%" width="200px" className={classes.sidebar}>
						<Box display="flex" alignItems="center" p={1}>
							<Typography component={Box} flexGrow={1}>
								{`${videos.length} videos in queue`}
							</Typography>
							<IconButton size="small" aria-label="delete" onClick={handleMinimize}>
								<span>{"─"}</span>
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
											<IconButton edge="end" aria-label="delete" onClick={() => handleDeleteVideo(v)}>
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

export default VideoPlayer;
