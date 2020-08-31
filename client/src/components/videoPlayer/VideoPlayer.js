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

const tabs = [
	{
		name: "youtube",
		icon: "icon-youtube-filled icon-2x",
	},
	{
		name: "twitch",
		icon: "icon-twitch-filled icon-2x",
	},
];

function VideoPlayer() {
	const classes = useStyles();
	const { state, dispatch } = useContext(VideoPlayerContext);
	const { videos, x, y, width, height, minimized } = state;
	const [currentTab, setCurrentTab] = useState(null);
	const [currentVideo, setCurrentVideo] = useState(null);
	const [restrictions, setRestrictions] = useState({
		minWidth: 600,
		minHeight: 300,
		maxWidth: document.documentElement.clientWidth - 20,
		maxHeight: document.documentElement.clientHeight - 80,
	});
	const [totalVideos, setTotalVideos] = useState(
		Object.keys(videos).map(source => videos[source].length).reduce((a, b) => a + b),
	);

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
	}, []); // eslint-disable-line

	useEffect(() => {
		if (!currentTab) {
			for (const tab of tabs) {
				if (videos[tab.name].length) {
					setCurrentTab(tab.name);
					break;
				}
			}
		} else if (currentTab && !currentVideo) {
			setCurrentVideo(videos[currentTab][0]);
		}
	}, [currentTab, videos, currentVideo]);

	useEffect(() => {
		setTotalVideos(Object.keys(videos).map(source => videos[source].length).reduce((a, b) => a + b));
	}, [videos]);

	function handleDeleteVideo(video) {
		dispatch({ type: "DELETE_VIDEO", videoSource: currentTab, video });
		if (currentVideo.url === video.url) setCurrentVideo(null);
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
		if (!currentVideo && totalVideos === 1) {
			handleMaximize();
		}
	}, [currentVideo, totalVideos]); // eslint-disable-line

	if (!currentVideo || !totalVideos) return null;

	if (minimized) {
		return (
			<Box position="fixed" bottom="15px" right="15px" zIndex={1}>
				<Tooltip title="Video player">
					<Badge badgeContent={totalVideos} overlap="circle" color="error">
						<Fab size="medium" onClick={handleMaximize}>
							<i className="icon-video-library icon-2x" />
						</Fab>
					</Badge>
				</Tooltip>
			</Box>
		);
	}

	return (
		<Rnd
			style={{ position: "fixed", zIndex: 1 }}
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
				<Box display="flex" flexDirection="column" height="100%" width="100%">
					<Box display="flex" alignItems="center" className={classes.background}>
						<Box flex="1" height="100%">
							<List disablePadding component={Box} height="100%" display="flex" flexDirection="row">
								{ tabs.map(tab => {
									if (videos[tab.name].length) {
										return (
											<ListItem
												className={classes.horizontalListItem}
												key={tab.name}
												button
												selected={tab.name === currentTab}
												onClick={tab.name === currentTab ? null : () => setCurrentTab(tab.name)}
											>
												<Box display="flex" alignItems="center" justifyContent="center" minWidth="56px">
													<i className={tab.icon} />
												</Box>
											</ListItem>
										);
									}
									return null;
								})}
							</List>
						</Box>
						<Box p={1}>
							<IconButton size="small" aria-label="delete" onClick={handleMinimize}>
								<span>{"─"}</span>
							</IconButton>
						</Box>
					</Box>
					<Box display="flex" flexGrow="1" minHeight="0">
						<Box flexGrow={1}>
							<ReactPlayer
								// playing
								controls
								url={currentVideo.url}
								height="100%"
								width="100%"
								onEnded={() => handleDeleteVideo(currentVideo)}
							/>
						</Box>
						<Box display="flex" flexDirection="column" height="100%" width="200px" className={classes.background}>
							<Typography textAlign="center" component={Box} p={1}>
								{`${videos[currentTab].length} video${videos[currentTab].length > 1 ? "s" : ""} in queue`}
							</Typography>
							<Box flexGrow={1} overflow="auto">
								<List disablePadding>
									{videos[currentTab].map(v => (
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
													<i className="icon-delete" />
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
									))}
								</List>
							</Box>
						</Box>
					</Box>
				</Box>
			</Paper>
		</Rnd>
	);
}

export default VideoPlayer;
