import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

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
	Icon,
	Avatar,
} from "@material-ui/core";

import { getComments } from "../../api/reddit";

import { formatDate, formatNumber, htmlEscape } from "../../utils/utils";

import { reddit as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function Post({ post, multipleSubs, onShowPreviousPost, onShowNextPost, inList, customStyles }) {
	const classes = useStyles({ inList });
	const [expandedView, setExpandedView] = useState(false);
	const [sideMenuView, setSideMenuView] = useState(true);
	const [comments, setComments] = useState([]);

	async function handleGetComments() {
		const response = await getComments(post.subreddit, post.id);

		if (response.status === 200) {
			setComments(response.data);
		}
	}

	useEffect(() => {
		async function fetchData() {
			return await handleGetComments();
		}

		fetchData();
	}, [post.id]);

	useEffect(() => {
		function updateSideMenuView() {
			if (window.innerWidth <= 900) handleCloseSideMenuView();
			else handleOpenSideMenuView();
		}

		window.addEventListener("resize", updateSideMenuView);
		updateSideMenuView();
		return () => window.removeEventListener("resize", updateSideMenuView);
	}, []);

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

	function formatTextPost() {
		return (
			<Box p={2} maxWidth={1450} style={{ backgroundColor: "#212121" }}>
				{post.text === "null" ? (
					<Typography>
						<Link href={post.url} target="_blank" rel="noreferrer" color="inherit">
							{post.url}
						</Link>
					</Typography>
				) : (
					<div className={classes.textContent} dangerouslySetInnerHTML={{ __html: htmlEscape(post.text) }} />
				)}
			</Box>
		);
	}

	function formatContent() {
		post.url = post.url.slice(-1) === "/" ? post.url.slice(0, -1) : post.url; // Remove last backslash
		post.url = post.url.replace("&amp;t", ""); // Broken youtube link

		const imgTypes = ["jpg", "jpeg", "png", "gif"];
		let content = null;
		let expandedContent = null;
		let isMedia = true;

		if (imgTypes.includes(post.url.substr(post.url.lastIndexOf(".") + 1))) {
			content = (
				<CardMedia component="img" src={post.url} className={classes.media} onClick={handleOpenExpandedView} />
			);
			expandedContent = (
				<img
					src={post.url}
					alt={post.url}
					style={{ width: "1000px", height: "inherit", maxWidth: "100%", maxHeight: "inherit", margin: "auto" }}
				/>
			);
		} else if (post.domain === "gfycat.com") {
			content = (
				<CardMedia
					component="iframe"
					src={`https://gfycat.com/ifr/${post.url.substr(post.url.lastIndexOf("/") + 1)}?autoplay=0&hd=1`}
					frameBorder={0}
					allowFullScreen
					className={classes.media}
					scrolling="no"
					style={{ minHeight: 400 }}
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
		} else if (post.domain === "i.imgur.com" && post.url.substr(post.url.lastIndexOf(".") + 1) === "gifv") {
			content = (
				<CardMedia component="video" src={`${post.url.slice(0, -5)}.mp4`} className={classes.media} controls />
			);
			expandedContent = content;
		} else if (post.domain === "v.redd.it") {
			if (expandedView)
				content = (
					<CardMedia
						component="video"
						src={post.redditVideo}
						className={classes.media}
						controls
						style={{ top: "5%", left: "10%", width: "80%", height: "80%" }}
					/>
				);
			else content = <CardMedia component="video" src={post.redditVideo} className={classes.media} controls />;
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
		} else {
			isMedia = false;
			content = formatTextPost(post);
			expandedContent = content;
		}

		return { isMedia, content, expandedContent };
	}

	function renderInfoOverlay() {
		return (
			<div style={{ zIndex: 1 }}>
				<div className={`${classes.overlay} ${classes.title}`} title={post.title}>
					<Typography>
						<Link href={post.permalink} target="_blank" rel="noreferrer" color="inherit">
							{htmlEscape(post.title)}
						</Link>
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
						<Link href={post.permalink} target="_blank" rel="noreferrer" color="inherit">
							{htmlEscape(post.title)}
						</Link>
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
						{post.flairs.map(flair => (
							<Chip key={flair} size="small" label={flair} />
						))}
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
						<Link href={post.permalink} target="_blank" rel="noreferrer" color="inherit">
							{htmlEscape(post.title)}
						</Link>
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
										}}
									>
										<i className="icon-arrow-left icon-1x" />
									</IconButton>

									{onShowPreviousPost && (
										<Box
											className={classes.expandedBtn}
											onClick={onShowPreviousPost}
											style={{
												backgroundColor: "rgb(66 66 66 / 0%)",
												position: "absolute",
												height: "100%",
												transform: "translateY(40%)",
											}}
										>
											<Box>
												<IconButton
													onClick={onShowPreviousPost}
													color="primary"
													style={{ backgroundColor: "#3C3C3C", padding: "8px", cursor: "pointer" }}
												>
													<i className="icon-arrow-left icon-1x" />
												</IconButton>
											</Box>
										</Box>
									)}
								</Box>

								<Box position="relative" height="100%" flexGrow={1} style={{ overflow: "auto" }}>
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
											marginRight: "10px",
										}}
									>
										<i className={sideMenuView ? "icon-arrow-right icon-1x" : "icon-arrow-left icon-1x"} />
									</IconButton>

									{onShowNextPost && (
										<Box
											className={classes.expandedBtn}
											onClick={onShowNextPost}
											style={{
												backgroundColor: "rgb(66 66 66 / 0%)",
												position: "absolute",
												marginLeft: "-20px",
												height: "100%",
												transform: "translateY(40%)",
											}}
										>
											<Box>
												<IconButton
													onClick={onShowPreviousPost}
													color="primary"
													style={{ backgroundColor: "#3C3C3C", padding: "8px", cursor: "pointer" }}
												>
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
												{post.subreddit}
											</Typography>
										</Box>
									</Box>
									<Box fontWeight={500} fontFamily="Monospace">
										<Typography variant="caption" style={{ fontSize: "13px" }}>
											{"Posted by u/"}
										</Typography>
										<Typography variant="caption" style={{ color: "#EC6E4C", fontSize: "13px" }}>
											{post.author}
										</Typography>
										<Typography variant="caption" style={{ fontSize: "13px" }}>
											{` • ${formatDate(post.created * 1000, null, true)}`}
										</Typography>
									</Box>
									<Box fontWeight={500} fontFamily="Monospace" py={1}>
										<Typography gutterBottom variant="h6" component="h6">
											{post.title}
										</Typography>
									</Box>
									<Box fontWeight={500} fontFamily="Monospace" pt={1}>
										<Typography variant="caption" style={{ fontSize: "13px" }}>
											{`${formatNumber(post.score)}`}
										</Typography>
										<Typography variant="caption" style={{ color: "#EC6E4C", fontSize: "13px" }}>
											{` score`}
										</Typography>
										<Typography variant="caption" style={{ fontSize: "13px" }}>
											{` • ${formatNumber(post.comments)}`}
										</Typography>
										<Typography variant="caption" style={{ color: "#EC6E4C", fontSize: "13px" }}>
											{` comments`}
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
								{comments.map(comment => (
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
													{comment.text}
												</Typography>

												<Box fontWeight={500} fontFamily="Monospace" pt={1}>
													<Typography variant="caption" style={{ fontSize: "13px" }}>
														{comment.score}
													</Typography>
													<Typography variant="caption" style={{ color: "#EC6E4C", fontSize: "13px" }}>
														{` score`}
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
																{reply.text}
															</Typography>

															<Box fontWeight={500} fontFamily="Monospace" pt={1}>
																<Typography variant="caption" style={{ fontSize: "13px" }}>
																	{comment.score}
																</Typography>
																<Typography variant="caption" style={{ color: "#EC6E4C", fontSize: "13px" }}>
																	{` score`}
																</Typography>
															</Box>
														</Box>
													</Box>
												</CardContent>
											))}
									</CardContent>
								))}
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
	multipleSubs: PropTypes.bool.isRequired,
	onShowPreviousPost: PropTypes.func,
	onShowNextPost: PropTypes.func,
	inList: PropTypes.bool,
	customStyles: PropTypes.object,
};

export default Post;
