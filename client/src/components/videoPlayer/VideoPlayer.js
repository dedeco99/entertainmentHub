import React, { useContext, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Rnd } from "react-rnd";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";
import GridLayout from "react-grid-layout";
import { toast } from "react-toastify";

import {
	makeStyles,
	List,
	ListItem,
	Box,
	IconButton,
	Typography,
	Paper,
	Tooltip,
	Fab,
	Badge,
	Divider,
	Button,
	MenuItem,
} from "@material-ui/core";

import Input from "../.partials/Input";

import { getPlaylistVideos } from "../../api/youtube";

import { VideoPlayerContext } from "../../contexts/VideoPlayerContext";
import { UserContext } from "../../contexts/UserContext";
import { YoutubeContext } from "../../contexts/YoutubeContext";

import { videoPlayer as styles } from "../../styles/VideoPlayer";

import { translate } from "../../utils/translations";

const useStyles = makeStyles(styles);

function VideoPlayer() {
	const classes = useStyles();
	const { state, dispatch } = useContext(VideoPlayerContext);
	const { user } = useContext(UserContext);
	const {
		state: { playlists },
	} = useContext(YoutubeContext);
	const [youtubePlaylistLink, setYoutubePlaylistLink] = useState("");
	const [youtubePlaylist, setYoutubePlaylist] = useState("");
	const { currentVideo, videos, x, y, width, height, minimized, selectedTab, showQueue } = state;
	const [restrictions, setRestrictions] = useState({
		minWidth: 600,
		minHeight: 300,
		maxWidth: document.documentElement.clientWidth - 20,
		maxHeight: document.documentElement.clientHeight - 80,
	});
	const [playlistId, setPlaylistId] = useState("");

	const tabs = [
		{
			name: "youtube",
			icon: "icon-youtube-filled icon-2x",
		},
		{
			name: "twitch",
			icon: "icon-twitch-filled icon-2x",
		},
		{
			name: "youtubePlaylists",
			icon: "icon-playlist icon-2x",
			showAlways: true,
		},
	];
	const totalVideos = Object.keys(videos)
		.map(source => videos[source].length)
		.reduce((a, b) => a + b);

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

	useEffect(() => {
		if (!selectedTab) {
			const tab = tabs.find(t => videos[t.name].length);

			if (tab) dispatch({ type: "SET_SELECTED_TAB", selectedTab: tab.name });
		} else if (selectedTab && !currentVideo) {
			dispatch({ type: "SET_CURRENT_VIDEO", currentVideo: videos[selectedTab][0] });
		}
	}, [selectedTab, videos, currentVideo]);

	function hasPreviousVideo() {
		const currentVideoIndex = videos[selectedTab].findIndex(video => video.url === currentVideo.url);

		return currentVideoIndex > 0;
	}

	function hasNextVideo() {
		const currentVideoIndex = videos[selectedTab].findIndex(video => video.url === currentVideo.url);

		return currentVideoIndex < videos[selectedTab].length - 1;
	}

	function handlePreviousVideo() {
		const currentIndexVideo = videos[selectedTab].findIndex(video => video.name === currentVideo.name);

		dispatch({ type: "SET_CURRENT_VIDEO", currentVideo: videos[selectedTab][currentIndexVideo - 1] });
	}

	function handleNextVideo() {
		const currentIndexVideo = videos[selectedTab].findIndex(video => video.name === currentVideo.name);

		dispatch({ type: "SET_CURRENT_VIDEO", currentVideo: videos[selectedTab][currentIndexVideo + 1] });
	}

	function handleDeleteVideo(video) {
		dispatch({ type: "DELETE_VIDEO", videoSource: selectedTab, video });
	}

	function handleDeleteVideos() {
		dispatch({ type: "DELETE_VIDEOS", videoSource: selectedTab });
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

	function handleTabChange(tab) {
		dispatch({ type: "SET_SELECTED_TAB", selectedTab: tab });
	}

	function calculateX() {
		const minX = 10;
		const maxX = document.documentElement.clientWidth - width - 10;

		if (x < minX) return minX;
		if (x > maxX) return maxX;
		return x;
	}

	function calculateY() {
		const minY = 0;
		const maxY = document.documentElement.clientHeight - height - 85;

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

	function handleOrderChange(layout, oldItem, newItem) {
		dispatch({ type: "CHANGE_ORDER", videoSource: selectedTab, oldPosition: oldItem.y, newPosition: newItem.y });
	}

	function handleShowQueue() {
		dispatch({ type: "SET_SHOW_QUEUE", showQueue: !showQueue });
	}

	useEffect(() => {
		if (!currentVideo && totalVideos === 1) {
			handleMaximize();
		}
	}, [currentVideo, totalVideos]);

	function calcQueueWidth() {
		const ROW_HEIGHT = 55;
		const HEADER_HEIGHT = 83;
		return videos[selectedTab].length * ROW_HEIGHT + HEADER_HEIGHT > height ? 233 : 250;
	}

	function handleYoutubeLink(e) {
		try {
			const youtubeLink = new URL(e.target.value);
			const id = youtubeLink.searchParams.get("list");

			setPlaylistId(id);
		} catch (err) {
			toast.error("Invalid url");
		}
	}

	function handleYoutubePlaylistLink(e) {
		setYoutubePlaylistLink(e.target.value);
		setYoutubePlaylist("");
		handleYoutubeLink(e);
	}

	function handleYoutubePlaylist(e) {
		setYoutubePlaylistLink("");
		setYoutubePlaylist(e.target.value);
		handleYoutubeLink(e);
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const response = await getPlaylistVideos(playlistId);

		if (response.status === 200) {
			dispatch({
				type: "SET_VIDEOS",
				videoSource: "youtubePlaylists",
				videos: response.data,
			});

			setYoutubePlaylist("");
			setYoutubePlaylistLink("");
		}
	}

	function renderQueueOrChat() {
		if (!showQueue) return null;

		return currentVideo.videoSource === "twitchStream" ? (
			<Box display="flex" flexDirection="column">
				<Box flexGrow={1}>
					<iframe
						title={currentVideo.channelName}
						frameBorder="0"
						scrolling="no"
						src={`https://www.twitch.tv/embed/${currentVideo.channelName}/chat?parent=${window.location.hostname}`}
						width="250px"
						height="100%"
					/>
				</Box>
				<Box textAlign="center">
					<IconButton edge="end" aria-label="delete" onClick={() => handleDeleteVideo(currentVideo)}>
						<i className="icon-delete" />
					</IconButton>
				</Box>
			</Box>
		) : (
			<Box display="flex" flexDirection="column" height="100%" width="250px" className={classes.background}>
				<Box>
					<Box display="flex" flexDirection="row" className={classes.queueList}>
						<Typography textAlign="center" component={Box} flexGrow={1} pt={1}>
							{`${videos[selectedTab].length} video${videos[selectedTab].length > 1 ? "s" : ""} in queue`}
						</Typography>
						<IconButton edge="end" aria-label="delete" onClick={handleDeleteVideos} style={{ right: "17px" }}>
							<i className="icon-delete" />
						</IconButton>
					</Box>
				</Box>
				<Divider />
				<Box flexGrow={1} className={classes.queueList}>
					<GridLayout
						className="layout"
						cols={1}
						rowHeight={55}
						width={calcQueueWidth()}
						margin={[0, 0]}
						isResizable={false}
						onDragStart={(layout, oldItem, newItem, placeholder, e) => {
							e.stopPropagation();
						}}
						onDragStop={handleOrderChange}
						draggableHandle=".handleListItem"
					>
						{videos[selectedTab].map((v, i) => (
							<div key={v.url} data-grid={{ x: 0, y: i, w: 1, h: 1 }}>
								<Box display="flex" height="100%" width="100%" position="relative">
									<Box
										display="flex"
										className="handleListItem"
										width="30px"
										height="100%"
										alignItems="center"
										justifyContent="center"
										style={{ cursor: "grab" }}
									>
										<i className="icon-drag-handle" />
									</Box>
									<ListItem
										button
										disableGutters
										onClick={() => dispatch({ type: "SET_CURRENT_VIDEO", currentVideo: v })}
										selected={currentVideo.url === v.url}
										component={Box}
										flex={1}
										pl={1}
										pr={6}
										minWidth={0}
									>
										<Box display="flex" flexDirection="column" flex="1 1 auto" minWidth={0}>
											<Typography variant="body1" title={v.name} noWrap>
												{v.name}
											</Typography>
											<Typography variant="caption" title={v.channelName} noWrap>
												{v.channelName}
											</Typography>
										</Box>
									</ListItem>
								</Box>
								<Box className={classes.listItemAction}>
									<IconButton edge="end" aria-label="delete" onClick={() => handleDeleteVideo(v)}>
										<i className="icon-delete" />
									</IconButton>
								</Box>
								<Divider />
							</div>
						))}
					</GridLayout>
				</Box>
				<Box textAlign="center" style={{ borderTop: "1px solid #ffffff3b" }}>
					<Tooltip title="Previous Video">
						<IconButton
							edge="end"
							aria-label="previousVideo"
							disabled={!hasPreviousVideo()}
							onClick={handlePreviousVideo}
						>
							<i className="icon-caret-left" />
						</IconButton>
					</Tooltip>
					<Tooltip title="Next Video">
						<IconButton edge="end" disabled={!hasNextVideo()} aria-label="nextVideo" onClick={handleNextVideo}>
							<i className="icon-caret-right" />
						</IconButton>
					</Tooltip>
				</Box>
			</Box>
		);
	}

	const tab = tabs.find(t => t.name === selectedTab);
	if ((tab && !tab.showAlways && !currentVideo) || !totalVideos) return null;

	if (minimized) {
		return (
			<Box position="fixed" bottom="15px" right="15px" zIndex={1}>
				<Tooltip title="Video player">
					<Badge badgeContent={totalVideos} overlap="circular" color="error">
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
								{tabs.map(t => {
									if (t.showAlways || videos[t.name].length) {
										return (
											<ListItem
												className={classes.horizontalListItem}
												key={t.name}
												button
												selected={t.name === selectedTab}
												onClick={t.name === selectedTab ? null : () => handleTabChange(t.name)}
											>
												<Box display="flex" alignItems="center" justifyContent="center" minWidth="56px">
													<i className={t.icon} />
												</Box>
											</ListItem>
										);
									}
									return null;
								})}
							</List>
						</Box>
						<Box p={1}>
							<IconButton size="small" onClick={handleShowQueue} style={{ marginRight: "10px" }}>
								<i className={showQueue ? "icon-arrow-right" : "icon-arrow-left"} />
							</IconButton>
							<IconButton size="small" onClick={handleMinimize}>
								<i className="icon-minimize" />
							</IconButton>
						</Box>
					</Box>
					<Box display="flex" flexGrow="1" minHeight="0">
						{selectedTab === "youtubePlaylists" && !videos[selectedTab].length ? (
							<Box display="flex" alignItems="center" justifyContent="center" textAlign="center" width="100%">
								<form onSubmit={handleSubmit} style={{ width: "100%" }}>
									<Box style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
										<Input
											type="text"
											label={"Playlist Link"}
											margin="normal"
											variant="outlined"
											onChange={handleYoutubePlaylistLink}
											value={youtubePlaylistLink}
											style={{ width: "30%", textAlign: "left" }}
										/>
										<Typography style={{ paddingRight: "10px", paddingLeft: "10px", marginTop: "10px" }}>
											{"or"}
										</Typography>
										<Input
											label="Youtube Playlists"
											variant="outlined"
											onChange={handleYoutubePlaylist}
											value={youtubePlaylist}
											select
											style={{ width: "30%", textAlign: "left", marginTop: "10px" }}
										>
											{playlists.map(p => (
												<MenuItem
													key={p.externalId}
													value={`https://www.youtube.com/playlist?list=${p.externalId}`}
												>
													{p.displayName}
												</MenuItem>
											))}
										</Input>
									</Box>
									<br />
									<Button type="submit" variant="contained" color="primary">
										{translate("add")}
									</Button>
								</form>
							</Box>
						) : (
							<>
								<Box flexGrow={1}>
									{currentVideo.videoSource === "twitchClip" ? (
										<iframe src={currentVideo.url} height="100%" width="100%" allowFullScreen />
									) : (
										<ReactPlayer
											// playing
											controls
											// eslint-disable-next-line react/jsx-boolean-value
											playing={user.settings.autoplayVideoPlayer}
											url={currentVideo ? currentVideo.url : null}
											height="100%"
											width="100%"
											onEnded={() => handleDeleteVideo(currentVideo)}
										/>
									)}
								</Box>
								{renderQueueOrChat()}
							</>
						)}
					</Box>
				</Box>
			</Paper>
		</Rnd>
	);
}

export default VideoPlayer;
