import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles, Zoom, Box, Typography, Link, List, ListItem } from "@material-ui/core";

import Loading from "./Loading";
import Widget from "../widgets/Widget";
import FeedDetail from "./FeedDetail";
import Post from "../reddit/Post";

import { YoutubeContext } from "../../contexts/YoutubeContext";
import { RedditContext } from "../../contexts/RedditContext";
import { VideoPlayerContext } from "../../contexts/VideoPlayerContext";

import { getVideos } from "../../api/youtube";
import { getPosts } from "../../api/reddit";
import { deleteFeed } from "../../api/feeds";

import { formatDate, formatVideoDuration } from "../../utils/utils";

import { widget as widgetStyles } from "../../styles/Widgets";
import { feed as feedStyles } from "../../styles/Youtube";
import { videoPlayer as videoPlayerStyles } from "../../styles/VideoPlayer";

const useStyles = makeStyles({ ...widgetStyles, ...feedStyles, ...videoPlayerStyles });

function Feed({ feed }) {
	const classes = useStyles();
	const { dispatch } = useContext(feed.platform === "youtube" ? YoutubeContext : RedditContext);
	const videoPlayer = useContext(VideoPlayerContext);
	const [posts, setPosts] = useState([]);
	const [open, setOpen] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			const response =
				feed.platform === "youtube"
					? await getVideos(feed.subscriptions.join(","))
					: await getPosts(feed.subscriptions.join("+"));

			if (response.status === 200 && isMounted) {
				setPosts(response.data);
				setOpen(true);
			}
		}

		fetchData();

		return () => (isMounted = false);
	}, [feed]);

	async function handleDeleteFeed() {
		const response = await deleteFeed(feed._id);

		if (response.status === 200) {
			dispatch({ type: "DELETE_FEED", feed: response.data });
		}
	}

	function handleOpenModal() {
		setOpenModal(true);
	}

	function handleCloseModal() {
		setOpenModal(false);
	}

	function handleAddToVideoPlayer(post) {
		videoPlayer.dispatch({
			type: "ADD_VIDEO",
			video: {
				name: post.videoTitle,
				thumbnail: post.thumbnail,
				url: `https://www.youtube.com/watch?v=${post.videoId}`,
				channelName: post.displayName,
				channelUrl: `https://www.youtube.com/channel/${post.channelId}`,
			},
		});
	}

	function renderVideos() {
		return posts.map(post => (
			<ListItem key={post.videoId} divider style={{ padding: 0, margin: 0 }}>
				<Box display="flex" flexDirection="column" flex="auto" minWidth={0}>
					<Box position="relative" className={classes.videoThumbnail}>
						<img src={post.thumbnail} width="100%" alt="Video thumbnail" />
						<Box position="absolute" bottom="0" right="0" px={0.5} style={{ backgroundColor: "#212121DD" }}>
							<Typography variant="caption">{formatVideoDuration(post.duration)}</Typography>
						</Box>
						<Box
							className={classes.videoPlayOverlay}
							display="flex"
							alignItems="center"
							justifyContent="center"
							onClick={() => handleAddToVideoPlayer(post)}
						>
							<span className="material-icons"> {"play_arrow"} </span>
						</Box>
					</Box>
					<Box style={{ paddingLeft: 5, paddingRight: 10 }}>
						<Typography className={classes.videoTitle} variant="body1" title={post.videoTitle}>
							<Link
								href={`https://www.youtube.com/watch?v=${post.videoId}`}
								target="_blank"
								rel="noreferrer"
								color="inherit"
							>
								{post.videoTitle}
							</Link>
						</Typography>
						<Typography variant="body2" title={post.displayName}>
							<Link
								href={`https://www.youtube.com/channel/${post.channelId}`}
								target="_blank"
								rel="noreferrer"
								color="inherit"
							>
								{post.displayName}
							</Link>
						</Typography>
						<Typography variant="caption">
							{`${formatDate(post.published, "DD-MM-YYYY HH:mm", true)} • ${post.views} views`}
						</Typography>
						<Box display="flex" flexDirection="row" flex="1 1 auto" minWidth={0}>
							<Typography variant="caption" style={{ paddingRight: "10px" }}>
								<i className="icofont-thumbs-up" />
								{` ${post.likes}`}
							</Typography>
							<Typography variant="caption">
								<i className="icofont-thumbs-down" />
								{` ${post.dislikes}`}
							</Typography>
						</Box>
					</Box>
				</Box>
			</ListItem>
		));
	}

	function renderPosts() {
		return posts.map(post => (
			<ListItem key={post.id} divider style={{ padding: 0, margin: 0 }}>
				<Post post={post} multipleSubs={Boolean(feed.subscriptions.length)} inList />
			</ListItem>
		));
	}

	function renderFeed() {
		if (!open) return <Loading />;

		return (
			<Zoom in={open}>
				<Box display="flex" flexDirection="column" className={classes.root}>
					<Box display="flex" alignItems="center" className={classes.header}>
						<Typography variant="subtitle1">{feed.displayName}</Typography>
					</Box>
					<Box
						display="flex"
						flexWrap="wrap"
						justifyContent="center"
						height="100%"
						style={{ overflow: "auto", width: "inherit" }}
					>
						<List>{feed.platform === "youtube" ? renderVideos() : renderPosts()}</List>
					</Box>
				</Box>
			</Zoom>
		);
	}

	return (
		<>
			<Widget
				id={feed._id}
				type={"youtube"}
				content={renderFeed()}
				editText={feed.displayName}
				editIcon={"icofont-youtube-play"}
				onEdit={handleOpenModal}
				onDelete={handleDeleteFeed}
			/>
			<FeedDetail open={openModal} platform={feed.platform} feed={feed} onClose={handleCloseModal} />
		</>
	);
}

Feed.propTypes = {
	feed: PropTypes.object.isRequired,
};

export default Feed;
