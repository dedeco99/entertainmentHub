/* eslint-disable max-lines */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";
import PrismaZoom from "react-prismazoom";

import {
	makeStyles,
	CardMedia,
	Box,
	Modal,
	Fade,
	Typography,
	Chip,
	Link,
	Divider,
	Paper,
	Grid,
	Card,
	CardContent,
	IconButton,
} from "@material-ui/core";

import Loading from "../.partials/Loading";

import { getComments } from "../../api/reddit";

import { formatDate, formatNumber, htmlEscape } from "../../utils/utils";

import { reddit as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function Post({ post, num, multipleSubs, onShowPreviousPost, onShowNextPost, inList, customStyles }) {
	const classes = useStyles({ inList });
	const [expandedView, setExpandedView] = useState(false);
	const [sideMenuView, setSideMenuView] = useState(true);
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);
	const [galleryIndex, setGalleryIndex] = useState(0);
	const [isHovered, setIsHovered] = useState(false);

	async function handleGetComments() {
		setLoading(true);

		const response = await getComments(post.subreddit, post.id);

		if (response.status === 200 && response.data) {
			setComments(response.data);
		}

		setLoading(false);
	}

	useEffect(() => {
		if (expandedView) handleGetComments();
	}, [post.id, expandedView]);

	useEffect(() => {
		setGalleryIndex(0);
	}, [post]);

	function handleCloseExpandedView() {
		setExpandedView(false);
	}

	function handleOpenExpandedView() {
		setExpandedView(true);
	}

	function handleOpenSideMenuView() {
		setSideMenuView(true);
	}

	function handleCloseSideMenuView() {
		setSideMenuView(false);
	}

	useEffect(() => {
		function updateSideMenuView() {
			if (window.innerWidth <= 900) handleCloseSideMenuView();
			else handleOpenSideMenuView();
		}

		window.addEventListener("resize", updateSideMenuView);
		updateSideMenuView();
		return () => window.removeEventListener("resize", updateSideMenuView);
	}, []);

	function formatTextPost(expanded) {
		const text =
			post.text === "null" ? (
				<Typography>
					<Link href={post.url} target="_blank" rel="noreferrer" color="inherit">
						{post.url}
					</Link>
				</Typography>
			) : (
				// eslint-disable-next-line react/no-danger
				<Box className={classes.textContent} dangerouslySetInnerHTML={{ __html: htmlEscape(`${post.text}`) }} />
			);

		return (
			<Box display="flex" alignItems="center" height="100%">
				{expanded ? (
					<Box p={2} maxWidth={1450} style={{ backgroundColor: "#212121", overflow: "auto" }} maxHeight="1000px">
						{text}
					</Box>
				) : (
					text
				)}
			</Box>
		);
	}

	// eslint-disable-next-line complexity
	function formatContent() {
		post.url = post.url.slice(-1) === "/" ? post.url.slice(0, -1) : post.url; // Remove last backslash
		post.url = post.url.replace("&amp;t", ""); // Broken youtube link

		const imgTypes = ["jpg", "jpeg", "png", "gif"];
		let content = null;
		let expandedContent = null;
		let isMedia = true;

		const imgType = post.url.substr(post.url.lastIndexOf(".") + 1);

		if (imgTypes.includes(imgType)) {
			content = (
				<img
					src={isHovered || imgType !== "gif" ? post.url : post.videoPreview}
					className={classes.media}
					onClick={handleOpenExpandedView}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				/>
			);
			expandedContent = (
				<PrismaZoom className={classes.zoomImage}>
					<img
						src={post.url}
						alt={post.url}
						style={{
							width: "100%",
							height: "100%",
							maxWidth: "100%",
							maxHeight: "100%",
							margin: "auto",
							display: "block",
							position: "absolute",
							objectFit: "contain",
							cursor: "zoom-in",
						}}
					/>
				</PrismaZoom>
			);
		} else if (post.gallery) {
			content = (
				<div className={classes.zoomImage}>
					<PrismaZoom className={classes.zoomImage} style={{ position: "absolute" }}>
						<CardMedia
							component="img"
							src={post.gallery[galleryIndex].image}
							className={classes.media}
							onClick={handleOpenExpandedView}
						/>
					</PrismaZoom>
					{galleryIndex > 0 && (
						<Box left="10px" className={classes.galleryBtn}>
							<IconButton
								onClick={() => setGalleryIndex(galleryIndex - 1)}
								color="primary"
								style={{ top: "18px", backgroundColor: "#3C3C3C", cursor: "pointer" }}
							>
								<i className="icon-caret-left icon-1x" />
							</IconButton>
						</Box>
					)}
					{galleryIndex < post.gallery.length - 1 && (
						<Box right="10px" className={classes.galleryBtn}>
							<IconButton
								onClick={() => setGalleryIndex(galleryIndex + 1)}
								color="primary"
								style={{ top: "18px", backgroundColor: "#3C3C3C", cursor: "pointer" }}
							>
								<i className="icon-caret-right icon-1x" />
							</IconButton>
						</Box>
					)}
					{post.gallery[galleryIndex].caption && (
						<Box className={classes.caption}>{post.gallery[galleryIndex].caption}</Box>
					)}
					<Box className={classes.galleryIndex}>{`${galleryIndex + 1}/${post.gallery.length}`}</Box>
				</div>
			);
			expandedContent = content;
		} else if (post.domain === "gfycat.com") {
			content = (
				<CardMedia
					component="iframe"
					src={`https://gfycat.com/ifr/${post.url.substr(post.url.lastIndexOf("/") + 1)}?autoplay=0&hd=1`}
					frameBorder={0}
					allowFullScreen
					className={classes.media}
					scrolling="no"
				/>
			);
			expandedContent = content;
		} else if (post.domain === "thumbs.gfycat.com") {
			content = (
				<CardMedia
					component="iframe"
					src={`${post.url}?autoplay=0&hd=1`}
					frameBorder={0}
					allowFullScreen
					className={classes.media}
					scrolling="no"
				/>
			);
			expandedContent = content;
		} else if (post.domain === "imgur.com") {
			const imgurId = post.url.substr(post.url.lastIndexOf("/") + 1);

			if (post.url.includes("gallery") || post.url.includes("/a/")) {
				content = (
					<CardMedia
						component="iframe"
						src={`https://imgur.com/a/${imgurId}/embed?pub=true`}
						className={classes.media}
						frameBorder={0}
						allowFullScreen
					/>
				);
			} else {
				content = (
					<CardMedia
						component="img"
						src={`${post.url}.png`}
						className={classes.media}
						onClick={handleOpenExpandedView}
					/>
				);
			}

			expandedContent = content;
		} else if (
			post.domain === "i.imgur.com" &&
			["gifv", "mp4"].includes(post.url.substr(post.url.lastIndexOf(".") + 1))
		) {
			content = (
				<CardMedia
					component="video"
					src={`${post.url.substr(0, post.url.lastIndexOf("."))}.mp4`}
					className={classes.media}
					controls
				/>
			);
			expandedContent = content;
		} else if (post.domain === "v.redd.it") {
			content = (
				<ReactPlayer
					controls
					url={`https://red-mode-fbb6.dedeco99.workers.dev/${post.redditVideo}`}
					width="100%"
					height="100%"
					className={classes.media}
				/>
			);
			expandedContent = content;
		} else if (post.domain === "youtube.com" || post.domain === "youtu.be") {
			const videoId = post.url.includes("?v=")
				? post.url.substr(post.url.lastIndexOf("?v=") + 3)
				: post.url.substr(post.url.lastIndexOf("/") + 1);
			// const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

			content = (
				<CardMedia
					component="iframe"
					src={`https://www.youtube.com/embed/${videoId}`}
					className={classes.media}
					frameBorder={0}
					allowFullScreen
				/>
			);
			expandedContent = content;
		} else if (post.url.includes("streamable")) {
			content = (
				<CardMedia
					component="iframe"
					src={`https://streamable.com/e/${post.url.substr(post.url.lastIndexOf("/") + 1)}`}
					className={classes.media}
					frameBorder={0}
					allowFullScreen
				/>
			);
			expandedContent = content;
		} else {
			isMedia = false;
			content = formatTextPost();
			expandedContent = formatTextPost(true);
		}

		return { isMedia, content, expandedContent };
	}

	function renderInfoOverlay() {
		return (
			<div style={{ zIndex: 1 }}>
				<div className={`${classes.overlay} ${classes.title}`} title={post.title}>
					<Typography>
						<Link onClick={handleOpenExpandedView}>{htmlEscape(post.title)}</Link>
					</Typography>
				</div>
				{multipleSubs && (
					<Typography className={`${classes.overlay} ${classes.subreddit}`} title={post.subreddit}>
						<Link href={`https://reddit.com/r/${post.subreddit}`} target="_blank" rel="noreferrer" color="inherit">
							{`r/${post.subreddit}`}
						</Link>
					</Typography>
				)}
				<div className={`${classes.overlay} ${classes.comments}`}>
					<i className="icon-comment" />
					{` ${post.comments}`}
				</div>
				<div className={`${classes.overlay} ${classes.score}`}>
					<i className="icon-caret-up" />
					{post.score}
					<i className="icon-caret-down" />
				</div>
				<div className={`${classes.overlay} ${classes.date}`}>{formatDate(post.created * 1000, null, true)}</div>
			</div>
		);
	}

	function renderInfoMedia() {
		return (
			<Box width="100%" position="absolute" top="100%" left="0">
				<Divider />
				<Box p={1}>
					<Typography>
						<Link onClick={handleOpenExpandedView}>{htmlEscape(post.title)}</Link>
					</Typography>
					{multipleSubs && (
						<Typography variant="caption" title={post.subreddit}>
							<Link
								href={`https://reddit.com/r/${post.subreddit}`}
								target="_blank"
								rel="noreferrer"
								color="inherit"
							>
								{`r/${post.subreddit}`}
							</Link>
						</Typography>
					)}
					<Box display="flex" flexWrap="wrap" className={classes.flairs}>
						{post.flairs.map((flair, i) =>
							flair.includes("https") ? (
								<img
									src={flair}
									style={{
										height: "25px",
										marginRight: !post.flairs[i + 1] || !post.flairs[i + 1].includes("https") ? "5px" : "0px",
									}}
								/>
							) : (
								<Chip key={flair} size="small" label={flair} />
							),
						)}
					</Box>
					<Box display="flex" style={{ paddingLeft: 25 }}>
						<Box display="flex" flexGrow={1} justifyContent="center">
							<Typography variant="caption">
								<i className="icon-caret-up" />
								{post.score}
								<i className="icon-caret-down" />
							</Typography>
						</Box>
						<Box display="flex" flexGrow={1} justifyContent="center">
							<Typography variant="caption">
								<i className="icon-comment" />
								{` ${post.comments}`}
							</Typography>
						</Box>
						<Box display="flex" flexGrow={1} justifyContent="center">
							<Typography variant="caption">{formatDate(post.created * 1000, null, true)}</Typography>
						</Box>
					</Box>
				</Box>
			</Box>
		);
	}

	function renderInfo() {
		return (
			<Box display="flex" flexDirection="column" className={classes.textHeader}>
				<Box display="flex" flexDirection="column">
					{multipleSubs && (
						<Typography variant="caption">
							<Link
								href={`https://reddit.com/r/${post.subreddit}`}
								target="_blank"
								rel="noreferrer"
								color="inherit"
							>
								{`r/${post.subreddit}`}
							</Link>
						</Typography>
					)}
					<Typography variant="h6">
						<Link onClick={handleOpenExpandedView}>{htmlEscape(post.title)}</Link>
					</Typography>
				</Box>
				<Box display="flex">
					<Box display="flex" flexGrow={1}>
						<Typography variant="caption">
							<i className="icon-caret-up" />
							{post.score}
							<i className="icon-caret-down" />
						</Typography>
					</Box>
					<Box display="flex">
						<Typography variant="caption">{formatDate(post.created * 1000, null, true)}</Typography>
					</Box>
				</Box>
			</Box>
		);
	}

	function getGif(comment) {
		const commentComponents = [];

		const commentLines = comment.text.split("\n");

		for (const line of commentLines) {
			const splitLine = line.split("![gif](");

			const giphyId = splitLine[1] ? splitLine[1].trim().substring(0, splitLine[1].trim().length - 1) : null;

			if (giphyId && splitLine[0]) commentComponents.push(splitLine[0]);

			commentComponents.push(
				giphyId && comment.media[giphyId] ? <CardMedia component="img" src={comment.media[giphyId]} /> : line,
			);
		}

		return <Box>{commentComponents}</Box>;
	}

	function renderComments() {
		return loading ? (
			<Box style={{ marginTop: "50px" }}>
				<Loading />
			</Box>
		) : (
			comments.map(comment => (
				<CardContent
					key={comment.id}
					style={{
						borderRadius: "1px",
						border: "1px solid rgba(255, 255, 255, 0.12)",
						borderLeft: "0px",
						borderRight: "0px",
						borderTop: "0px",
						backgroundColor: "#212121",
					}}
				>
					<Box fontWeight={500} fontFamily="Monospace" pt={1}>
						<Typography variant="caption" style={{ fontSize: "13px" }}>
							{comment.author}
						</Typography>
						<Typography variant="caption" style={{ fontSize: "11px", color: "rgb(236, 110, 76)" }}>
							{` • ${formatDate(comment.created * 1000, null, true)}`}
						</Typography>
					</Box>
					<Box
						style={{
							display: "inline-flex",
						}}
					>
						<Divider orientation="vertical" flexItem />
						<Box fontWeight={500} fontFamily="Monospace" pt={1} style={{ marginLeft: "10px" }}>
							<Typography variant="caption" style={{ fontSize: "12px" }}>
								{comment.media ? getGif(comment) : comment.text}
							</Typography>
							<Box fontWeight={500} fontFamily="Monospace" pt={1}>
								<Typography variant="caption" style={{ fontSize: "13px" }}>
									{comment.score}
								</Typography>
								<Typography variant="caption" style={{ color: "#EC6E4C", fontSize: "13px", marginLeft: "6px" }}>
									<i className="icon-arrow-up-bold icon-1x" />
								</Typography>
							</Box>
						</Box>
					</Box>
					{comment.replies &&
						comment.replies.map(reply => (
							<CardContent key={reply.id}>
								<Box fontWeight={500} fontFamily="Monospace" pt={1}>
									<Typography variant="caption" style={{ fontSize: "13px" }}>
										{reply.author}
									</Typography>
									<Typography variant="caption" style={{ fontSize: "11px", color: "rgb(236, 110, 76)" }}>
										{` • ${formatDate(reply.created * 1000, null, true)}`}
									</Typography>
								</Box>
								<Box
									style={{
										display: "inline-flex",
									}}
								>
									<Divider orientation="vertical" flexItem />
									<Box fontWeight={500} fontFamily="Monospace" pt={1} style={{ marginLeft: "10px" }}>
										<Typography variant="caption" style={{ fontSize: "12px" }}>
											{reply.media ? getGif(reply) : reply.text}
										</Typography>
										<Box fontWeight={500} fontFamily="Monospace" pt={1}>
											<Typography variant="caption" style={{ fontSize: "13px" }}>
												{reply.score}
											</Typography>
											<Typography
												variant="caption"
												style={{ color: "#EC6E4C", fontSize: "13px", marginLeft: "6px" }}
											>
												<i className="icon-arrow-up-bold icon-1x" />
											</Typography>
										</Box>
									</Box>
								</Box>
							</CardContent>
						))}
				</CardContent>
			))
		);
	}

	const { isMedia, content, expandedContent } = formatContent();
	const widgetInfo = isMedia ? renderInfoMedia() : renderInfo();

	return (
		<Box display="flex" flexDirection="column" flexGrow={1} className={classes.content} style={customStyles}>
			<Box display="flex" flexDirection="column" width="100%">
				{inList && isMedia ? renderInfoOverlay() : widgetInfo}
				{inList ? (
					<Box position="relative" overflow="auto">
						{content}
					</Box>
				) : (
					content
				)}
			</Box>
			<Modal className={classes.modal} open={expandedView} onClose={handleCloseExpandedView} closeAfterTransition>
				<Grid container style={{ outline: "none", height: "100%" }}>
					<Grid item xs={sideMenuView ? 9 : 12}>
						<Fade
							in={expandedView}
							style={{ outline: "none", height: "100%", width: "100%", backgroundColor: "#4242426b" }}
						>
							<Paper component={Box} display="flex" className={classes.expandedView}>
								<Box>
									<IconButton
										color="primary"
										onClick={handleCloseExpandedView}
										variant="contained"
										style={{
											marginTop: "10px",
											marginLeft: "10px",
											backgroundColor: "#3C3C3C",
											padding: "8px",
											fontSize: "1.2rem",
										}}
									>
										<i className="icon-cross icon-1x" />
									</IconButton>
									{onShowPreviousPost && num ? (
										<Box
											className={classes.expandedBtn}
											onClick={onShowPreviousPost}
											style={{
												backgroundColor: "rgb(66 66 66 / 0%)",
												position: "relative",
												height: "100%",
												transform: "translateY(45%)",
											}}
										>
											<Box>
												<IconButton color="primary" style={{ backgroundColor: "#3C3C3C", cursor: "pointer" }}>
													<i className="icon-arrow-left icon-1x" />
												</IconButton>
											</Box>
										</Box>
									) : null}
								</Box>
								<Box position="relative" height="100%" flexGrow={1} style={{ overflow: "hidden" }}>
									{expandedContent}
								</Box>
								<Box>
									<IconButton
										color="primary"
										onClick={sideMenuView ? handleCloseSideMenuView : handleOpenSideMenuView}
										variant="contained"
										style={{
											marginTop: "10px",
											backgroundColor: "#3C3C3C",
											padding: "8px",
											marginLeft: "20px",
										}}
									>
										<i className={sideMenuView ? "icon-caret-right icon-1x" : "icon-caret-left icon-1x"} />
									</IconButton>
									{onShowNextPost && (
										<Box
											className={classes.expandedBtn}
											onClick={onShowNextPost}
											style={{
												backgroundColor: "rgb(66 66 66 / 0%)",
												position: "relative",
												height: "100%",
												transform: "translateY(45%)",
											}}
										>
											<Box>
												<IconButton color="primary" style={{ backgroundColor: "#3C3C3C", cursor: "pointer" }}>
													<i className="icon-arrow-right icon-1x" />
												</IconButton>
											</Box>
										</Box>
									)}
								</Box>
							</Paper>
						</Fade>
					</Grid>
					{sideMenuView && (
						<Grid
							xs={3}
							style={{ outline: "none", height: "100%", backgroundColor: "#212121", overflowY: "scroll" }}
						>
							<Card
								variant="outlined"
								style={{
									borderRadius: "1px",
									border: "1px solid rgba(255, 255, 255, 0.12)",
									borderLeft: "0px",
									borderRight: "0px",
									borderTop: "0px",
									backgroundColor: "#212121",
								}}
							>
								<CardContent>
									<Box fontWeight={500} fontFamily="Monospace">
										<Box fontWeight={500} fontFamily="Monospace" pt={1}>
											<Typography variant="caption" style={{ fontSize: "13px" }}>
												{"r/"}
											</Typography>
											<Typography variant="caption" style={{ color: "#EC6E4C", fontSize: "13px" }}>
												<Link
													href={`https://reddit.com/r/${post.subreddit}`}
													target="_blank"
													rel="noreferrer"
													color="inherit"
												>
													{post.subreddit}
												</Link>
											</Typography>
										</Box>
									</Box>
									<Box fontWeight={500} fontFamily="Monospace">
										<Typography variant="caption" style={{ fontSize: "13px" }}>
											{"Posted by u/"}
										</Typography>
										<Typography variant="caption" style={{ color: "#EC6E4C", fontSize: "13px" }}>
											<Link
												href={`https://reddit.com/u/${post.author}`}
												target="_blank"
												rel="noreferrer"
												color="inherit"
											>
												{post.author}
											</Link>
										</Typography>
										<Typography variant="caption" style={{ fontSize: "13px" }}>
											{` • ${formatDate(post.created * 1000, null, true)}`}
										</Typography>
									</Box>
									<Box fontWeight={500} fontFamily="Monospace" py={1}>
										<Typography gutterBottom variant="h6" component="h6">
											<Link href={post.permalink} target="_blank" rel="noreferrer" color="inherit">
												{htmlEscape(post.title)}
											</Link>
										</Typography>
									</Box>
									<Box fontWeight={500} fontFamily="Monospace" pt={1}>
										<Typography variant="caption" style={{ fontSize: "13px" }}>
											{`${formatNumber(post.score)}`}
										</Typography>
										<Typography
											variant="caption"
											style={{ color: "#EC6E4C", fontSize: "13px", marginLeft: "6px" }}
										>
											<i className="icon-arrow-up-bold icon-1x" />
										</Typography>
										<Typography variant="caption" style={{ fontSize: "13px" }}>
											{` • ${formatNumber(post.comments)}`}
										</Typography>
										<Typography
											variant="caption"
											style={{ color: "#EC6E4C", fontSize: "13px", marginLeft: "6px" }}
										>
											<i className="icon-bubbles icon-1x" />
										</Typography>
									</Box>
								</CardContent>
							</Card>
							<Card
								variant="outlined"
								style={{
									borderRadius: "1px",
									border: "1px solid rgba(255, 255, 255, 0.12)",
									borderLeft: "0px",
									borderRight: "0px",
									borderTop: "0px",
									borderBottom: "0px",
									backgroundColor: "#212121",
								}}
							>
								{renderComments()}
							</Card>
						</Grid>
					)}
				</Grid>
			</Modal>
		</Box>
	);
}

Post.propTypes = {
	post: PropTypes.object.isRequired,
	num: PropTypes.number,
	multipleSubs: PropTypes.bool.isRequired,
	onShowPreviousPost: PropTypes.func,
	onShowNextPost: PropTypes.func,
	inList: PropTypes.bool,
	customStyles: PropTypes.object,
};

export default Post;
