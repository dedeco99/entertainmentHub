/* eslint-disable react/no-danger */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Zoom from "@material-ui/core/Zoom";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Box from "@material-ui/core/Box";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";

import { getPosts } from "../../api/reddit";
import { formatDate } from "../../utils/utils";

import { reddit as styles } from "../../styles/Widgets";

class Reddit extends Component {
	constructor() {
		super();
		this.state = {
			posts: [],
			num: 0,

			open: false,
			showInfo: true,
			expandedView: false,
		};

		this.handleShowPreviousPost = this.handleShowPreviousPost.bind(this);
		this.handleShowNextPost = this.handleShowNextPost.bind(this);
		this.handleShowInfo = this.handleShowInfo.bind(this);
		this.handleHideInfo = this.handleHideInfo.bind(this);

		this.handleCloseExpandedView = this.handleCloseExpandedView.bind(this);
		this.handleOpenExpandedView = this.handleOpenExpandedView.bind(this);
	}

	async componentDidMount() {
		const { subreddit } = this.props;

		await this.getPosts(subreddit);
	}

	async getPosts(subreddit) {
		const response = await getPosts(subreddit);

		if (response.data) {
			this.setState({ posts: response.data, open: true });
		}
	}

	htmlEscape(str) {
		return String(str)
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/<a/g, "<a target='_blank' rel='noopener noreferrer'")
			.replace(/<table/g, "<div style='overflow: auto'><table")
			.replace(/<\/table>/g, "</table></div>");
	}

	handleShowPreviousPost() {
		const { num } = this.state;

		if (num > 0) this.setState({ num: num - 1 });
	}

	handleShowNextPost() {
		const { num, posts } = this.state;

		if (num < posts.length - 1) this.setState({ num: num + 1 });
	}


	handleShowInfo() {
		this.setState({ showInfo: true });
	}

	handleHideInfo() {
		this.setState({ showInfo: false });
	}

	handleCloseExpandedView() {
		this.setState({ expandedView: false });
	}

	handleOpenExpandedView() {
		this.setState({ expandedView: true });
	}

	// eslint-disable-next-line max-lines-per-function,complexity
	render() {
		const { classes } = this.props;
		const { posts, num, open, showInfo, expandedView } = this.state;

		if (!posts || !posts.length) return null;

		const post = posts[num];

		post.url = post.url.slice(-1) === "/" ? post.url.slice(0, -1) : post.url; // Remove last backslash
		post.url = post.url.replace("&amp;t", ""); // Broken youtube link

		const imgTypes = ["jpg", "jpeg", "png", "gif"];
		let content = null;
		let expandedContent = null;
		let isMedia = true;

		if (imgTypes.includes(post.url.substr(post.url.lastIndexOf(".") + 1))) {
			content = (
				<CardMedia
					component="img"
					src={post.url}
					className={classes.media}
				/>
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
				/>
			);
		} else if (post.domain === "imgur.com") {
			const imgurId = post.url.substr(post.url.lastIndexOf("/") + 1);

			const imgurLink = post.url.includes("gallery") || post.url.includes("/a/")
				? `https://imgur.com/a/${imgurId}/embed?pub=true`
				: `https://imgur.com/${imgurId}/embed?pub=true`;

			content = (
				<CardMedia
					component="iframe"
					src={imgurLink}
					className={classes.media}
					frameBorder={0}
					allowFullScreen
				/>
			);
		} else if (post.domain === "i.imgur.com" && post.url.substr(post.url.lastIndexOf(".") + 1) === "gifv") {
			content = (
				<CardMedia
					component="video"
					src={`${post.url.slice(0, -5)}.mp4`}
					className={classes.media}
					controls
				/>
			);
		} else if (post.domain === "v.redd.it") {
			content = (
				<CardMedia
					component="video"
					src={post.redditVideo}
					className={classes.media}
					controls
				/>
			);
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
		} else {
			isMedia = false;
			content = (
				<Box display="flex" flexDirection="column" className={classes.widthFix}>
					<Box display="flex" flexDirection="column" className={classes.textHeader}>
						<Box display="flex">
							<Typography variant="h6"> {post.title} </Typography>
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
								<Typography variant="caption">
									{formatDate(post.created * 1000, null, true)}
								</Typography>
							</Box>
						</Box>
					</Box>
					<div
						className={classes.textContent}
						dangerouslySetInnerHTML={{ __html: this.htmlEscape(post.text) }}
					/>
				</Box>
			);
		}

		const info = (
			<div>
				<div
					className={`${classes.overlay} ${classes.title} ${!showInfo && classes.hide}`}
					title={post.title}
				>
					{post.title}
				</div>
				<div className={`${classes.overlay} ${classes.score} ${!showInfo && classes.hide}`}>
					<i className="icofont-caret-up" />
					{post.score}
					<i className="icofont-caret-down" />
				</div>
				<div className={`${classes.overlay} ${classes.date} ${!showInfo && classes.hide}`}>
					{formatDate(post.created * 1000, null, true)}
				</div>
			</div >
		);

		return (
			<Zoom in={open}>
				<Card
					variant="outlined"
					className={classes.root}
				>
					<Box display="flex" flexDirection="column" className={classes.wrapper}>
						<Modal
							className={classes.modal}
							open={expandedView}
							onClose={this.handleCloseExpandedView}
							closeAfterTransition
							BackdropComponent={Backdrop}
							BackdropProps={{ invisible: true }}
						>
							<Fade in={expandedView}>
								<Card variant="outlined" className={classes.expandedView} onClick={this.handleCloseExpandedView}>
									{expandedContent}
								</Card>
							</Fade>
						</Modal>
						<Box
							display="flex"
							flexGrow={1}
							className={classes.content}
							onMouseEnter={this.handleHideInfo}
							onMouseLeave={this.handleShowInfo}
							onClick={isMedia ? this.handleOpenExpandedView : null}
						>
							{isMedia ? info : null}
							{content}
						</Box>
						<Box display="flex" className={classes.arrows}>
							<Box
								display="flex"
								flex="1"
								justifyContent="center"
								onClick={this.handleShowPreviousPost}
								className={classes.arrowsBorder}
							>
								<i className="icofont-caret-left" />
							</Box>
							<Box
								display="flex"
								flex="1"
								justifyContent="center"
								onClick={this.handleShowNextPost}
							>
								<i className="icofont-caret-right" />
							</Box>
						</Box>
					</Box>
				</Card>
			</Zoom>
		);
	}
}

Reddit.propTypes = {
	classes: PropTypes.object.isRequired,
	subreddit: PropTypes.string.isRequired,
};

export default withStyles(styles)(Reddit);