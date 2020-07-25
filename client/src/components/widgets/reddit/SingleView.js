import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

import Zoom from "@material-ui/core/Zoom";
import CardMedia from "@material-ui/core/CardMedia";
import Box from "@material-ui/core/Box";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Link from "@material-ui/core/Link";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";

import { formatDate, htmlEscape } from "../../../utils/utils";

import { reddit as styles } from "../../../styles/Widgets";

const useStyles = makeStyles(styles);

function SingleView({ open, posts, num, multipleSubs, onShowPreviousPost, onShowNextPost, onShowListView }) {
	const classes = useStyles();
	const [expandedView, setExpandedView] = useState(false);

	function handleCloseExpandedView() {
		setExpandedView(false);
	}

	function handleOpenExpandedView() {
		setExpandedView(true);
	}

	function formatTextPost(post) {
		return (
			<Box display="flex" flexDirection="column" className={classes.widthFix}>
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
								<i className="icofont-caret-up" />
								{post.score}
								<i className="icofont-caret-down" />
							</Typography>
						</Box>
						<Box display="flex">
							<Typography variant="caption">{formatDate(post.created * 1000, null, true)}</Typography>
						</Box>
					</Box>
				</Box>
				<Box p={2}>
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
			</Box>
		);
	}

	function formatContent(post) {
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

			const imgurLink =
				post.url.includes("gallery") || post.url.includes("/a/")
					? `https://imgur.com/a/${imgurId}/embed?pub=true`
					: `https://imgur.com/${imgurId}/embed?pub=true`;

			content = (
				<CardMedia
					component="iframe"
					src={imgurLink}
					className={classes.media}
					frameBorder={0}
					allowFullScreen
					scrolling="no"
				/>
			);
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

	/*
	function renderInfoBackup(post) {
		return (
			<div>
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
					<i className="icofont-comment" />
					{` ${post.comments}`}
				</div>
				<div className={`${classes.overlay} ${classes.score}`}>
					<i className="icofont-caret-up" />
					{post.score}
					<i className="icofont-caret-down" />
				</div>
				<div className={`${classes.overlay} ${classes.date}`}>{formatDate(post.created * 1000, null, true)}</div>
			</div>
		);
	}
	*/

	function renderInfo(post) {
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
								<i className="icofont-caret-up" />
								{post.score}
								<i className="icofont-caret-down" />
							</Typography>
						</Box>
						<Box display="flex" flexGrow={1} justifyContent="center">
							<Typography variant="caption">
								<i className="icofont-comment" />
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

	if (!posts || !posts.length) return null;

	const { isMedia, content, expandedContent } = formatContent(posts[num]);

	return (
		<Zoom in={open}>
			<Box variant="outlined" className={classes.root}>
				<Box display="flex" flexDirection="column" className={classes.wrapper}>
					<Modal
						className={classes.modal}
						open={expandedView}
						onClose={handleCloseExpandedView}
						closeAfterTransition
					>
						<Fade in={expandedView}>
							<Paper component={Box} display="flex" className={classes.expandedView}>
								<Box className={classes.expandedBtn} onClick={onShowPreviousPost}>
									<Box display="flex" alignItems="center" height="100%">
										<i className="icofont-arrow-left icofont-3x" />
									</Box>
								</Box>
								<Box position="relative" height="100%" flexGrow={1} style={{ overflow: "auto" }}>
									{expandedContent}
								</Box>
								<Box className={classes.expandedBtn} onClick={onShowNextPost}>
									<Box display="flex" alignItems="center" height="100%">
										<i className="icofont-arrow-right icofont-3x" />
									</Box>
								</Box>
							</Paper>
						</Fade>
					</Modal>
					<Box display="flex" flexDirection="column" flexGrow={1} className={classes.content}>
						{content}
						{isMedia && renderInfo(posts[num])}
					</Box>
					<Box display="flex" className={classes.arrows}>
						<Box display="flex" flex="1" justifyContent="center" alignItems="center" onClick={onShowPreviousPost}>
							<i className="icofont-caret-left" />
						</Box>
						<Box display="flex" onClick={onShowListView} className={classes.header}>
							<i className="icofont-listing-box" />
						</Box>
						<Box display="flex" flex="1" justifyContent="center" alignItems="center" onClick={onShowNextPost}>
							<i className="icofont-caret-right" />
						</Box>
					</Box>
				</Box>
			</Box>
		</Zoom>
	);
}

SingleView.propTypes = {
	open: PropTypes.bool.isRequired,
	posts: PropTypes.array.isRequired,
	num: PropTypes.number.isRequired,
	multipleSubs: PropTypes.bool.isRequired,
	onShowPreviousPost: PropTypes.func.isRequired,
	onShowNextPost: PropTypes.func.isRequired,
	onShowListView: PropTypes.func.isRequired,
};

export default SingleView;
