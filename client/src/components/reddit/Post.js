import React, { useState } from "react";
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
} from "@material-ui/core";

import { formatDate, htmlEscape } from "../../utils/utils";

import { reddit as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function Post({ post, multipleSubs, onShowPreviousPost, onShowNextPost, inList, customStyles }) {
	const classes = useStyles({ inList });
	const [expandedView, setExpandedView] = useState(false);

	function handleCloseExpandedView() {
		setExpandedView(false);
	}

	function handleOpenExpandedView() {
		setExpandedView(true);
	}

	function formatTextPost() {
		return (
			<Box p={2} maxHeight={400}>
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
			expandedContent = <img src={post.url} alt={post.url} />;
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
			content = <CardMedia component="video" src={post.redditVideo} className={classes.media} controls />;
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
				<Fade in={expandedView}>
					<Paper component={Box} display="flex" className={classes.expandedView}>
						{onShowPreviousPost && (
							<Box className={classes.expandedBtn} onClick={onShowPreviousPost}>
								<Box display="flex" alignItems="center" height="100%">
									<i className="icon-arrow-left icon-2x" />
								</Box>
							</Box>
						)}
						<Box position="relative" height="100%" flexGrow={1} style={{ overflow: "auto" }}>
							{expandedContent}
						</Box>
						{onShowNextPost && (
							<Box className={classes.expandedBtn} onClick={onShowNextPost}>
								<Box display="flex" alignItems="center" height="100%">
									<i className="icon-arrow-right icon-2x" />
								</Box>
							</Box>
						)}
					</Paper>
				</Fade>
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
