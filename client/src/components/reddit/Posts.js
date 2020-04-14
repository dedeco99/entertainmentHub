import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Zoom from "@material-ui/core/Zoom";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";

import { getPosts } from "../../api/reddit";
import { formatDate } from "../../utils/utils";

import placeholder from "../../img/noimage.png";

import styles from "../../styles/Reddit";

class Post extends Component {
	constructor() {
		super();
		this.state = {
			posts: [],
			num: 0,

			open: false,
			showInfo: true,
		};

		this.showInfo = this.showInfo.bind(this);
		this.hideInfo = this.hideInfo.bind(this);
	}

	async componentDidMount() {
		const { subreddit } = this.props;

		const response = await getPosts(subreddit);

		if (response.data) {
			response.data = response.data.filter(post => post.thumbnail !== "self");

			this.setState({ posts: response.data, open: true });
		}
	}

	htmlEscape(str) {
		return String(str).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
	}

	showInfo() {
		this.setState({ showInfo: true });
	}

	hideInfo() {
		this.setState({ showInfo: false });
	}

	// eslint-disable-next-line max-lines-per-function,complexity
	render() {
		const { classes } = this.props;
		const { posts, num, open, showInfo } = this.state;

		if (!posts || !posts.length) return null;

		const post = posts[num];

		post.url = post.url.slice(-1) === "/" ? post.url.slice(0, -1) : post.url; // Remove last backslash
		post.url = post.url.replace("&amp;t", ""); // Broken youtube link

		const imgTypes = ["jpg", "jpeg", "png", "gif"];
		let content = null;

		if (imgTypes.includes(post.url.substr(post.url.lastIndexOf(".") + 1))) {
			content = (
				<CardMedia
					component="img"
					src={post.url}
					className={classes.media}
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
			content = <CardMedia component="img" src={placeholder} className={classes.media} />;
			// content = <div style={{ padding: "40px 10px 20px 10px" }} dangerouslySetInnerHTML={{ __html: this.htmlEscape(post.text) }} />
		}

		const info = (
			<div>
				<div
					className={`${classes.overlay} ${classes.title} ${!showInfo && classes.hide}`}
					title={post.title}
				>
					{post.title}
				</div>
				<div
					className={`${classes.overlay} ${classes.previous}`}
					onClick={num > 0 ? () => this.setState({ num: num - 1 }) : null}
					onMouseEnter={this.showInfo}
					onMouseLeave={this.hideInfo}
				>
					{"<"}
				</div>
				<div
					className={`${classes.overlay} ${classes.next}`}
					onClick={num < posts.length - 1 ? () => this.setState({ num: num + 1 }) : null}
					onMouseEnter={this.showInfo}
					onMouseLeave={this.hideInfo}
				>
					{">"}
				</div>
				<div className={`${classes.overlay} ${classes.score} ${!showInfo && classes.hide}`}>
					{`↑ ${post.score} ↓`}
				</div>
				<div className={`${classes.overlay} ${classes.date} ${!showInfo && classes.hide}`}>
					{formatDate(post.created * 1000, null, true)}
				</div>
			</div >
		);

		return (
			<Zoom in={open}>
				<Card
					className={classes.root}
					onMouseEnter={this.hideInfo}
					onMouseLeave={this.showInfo}
				>
					{info}
					{content}
				</Card>
			</Zoom>
		);
	}
}

Post.propTypes = {
	classes: PropTypes.object.isRequired,
	subreddit: PropTypes.string.isRequired,
};

export default withStyles(styles)(Post);
