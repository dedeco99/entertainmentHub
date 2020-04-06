import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";

import { getPosts } from "../../actions/reddit";

import placeholder from "../../img/noimage.png";

const styles = () => ({
	root: {
		backgroundColor: "#212121dd",
	},
	overlay: {
		position: "absolute",
		color: "white",
		backgroundColor: "#212121dd",
		padding: "3px",
		borderRadius: "3px",
	},
	title: {
		top: "5px",
		left: "5px",
	},
	previous: {
		top: "50%",
		left: "5px",
	},
	next: {
		top: "50%",
		right: "5px",
	},
	score: {
		bottom: "5px",
		right: "5px",
	},
	comments: {
		bottom: "5px",
		left: "5px",
	},
});

class Post extends Component {
	constructor() {
		super();
		this.state = {
			posts: [],
			num: 0,
		};
	}

	async componentDidMount() {
		const response = await getPosts();

		response.data = response.data.filter(post => post.thumbnail !== "self");

		this.setState({ posts: response.data });
	}

	htmlEscape(str) {
		return String(str)
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">");
	}

	// eslint-disable-next-line max-lines-per-function,complexity
	render() {
		const { classes } = this.props;
		const { posts, num } = this.state;

		if (!posts || !posts.length) return null;

		const post = posts[num];

		post.url = post.url.slice(-1) === "/" ? post.url.slice(0, -1) : post.url; // Remove last backslash
		post.url = post.url.replace("&amp;t", ""); // Broken youtube link

		const imgTypes = ["jpg", "jpeg", "png", "gif"];
		let content = null;

		if (imgTypes.includes(post.url.substr(post.url.lastIndexOf(".") + 1))) {
			content = <CardMedia component="img" src={post.url} height="400px" />;
		} else if (post.domain === "gfycat.com") {
			content = (
				<CardMedia
					component="iframe"
					src={`https://gfycat.com/ifr/${post.url.substr(post.url.lastIndexOf("/") + 1)}?autoplay=0&hd=1`}
					height="400px"
					frameBorder={0}
					allowFullScreen
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
					height="400px"
					frameBorder={0}
					allowFullScreen
				/>
			);
		} else if (post.domain === "i.imgur.com" && post.url.substr(post.url.lastIndexOf(".") + 1) === "gifv") {
			content = (
				<CardMedia
					component="video"
					src={`${post.url.slice(0, -5)}.mp4`}
					height="400px"
					controls
				/>
			);
		} else if (post.domain === "v.redd.it") {
			content = (
				<CardMedia
					component="video"
					src={post.redditVideo}
					height="400px"
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
					height="400px"
					frameBorder={0}
					allowFullScreen
				/>
			);
		} else {
			content = <CardMedia component="img" src={placeholder} height="400px" />;
			// content = <div style={{ padding: "40px 10px 20px 10px" }} dangerouslySetInnerHTML={{ __html: this.htmlEscape(post.text) }} />
		}

		const info = (
			<div>
				<div className={`${classes.overlay} ${classes.title}`}>
					{post.title}
				</div>
				<div
					className={`${classes.overlay} ${classes.previous}`}
					onClick={num > 0 ? () => this.setState({ num: num - 1 }) : null}
				>
					{"<"}
				</div>
				<div
					className={`${classes.overlay} ${classes.next}`}
					onClick={num < posts.length - 1 ? () => this.setState({ num: num + 1 }) : null}
				>
					{">"}
				</div>
				<div className={`${classes.overlay} ${classes.score}`}>
					{`${post.upvotes} | ${post.downvotes}`}
				</div>
				<div className={`${classes.overlay} ${classes.comments}`}>
					{post.comments}
				</div>
			</div >
		);

		return (
			<Card className={classes.root}>
				<CardActionArea>
					{content}
					{info}
				</CardActionArea>
			</Card>
		);
	}
}

Post.propTypes = {
	classes: PropTypes.object,
};

export default withStyles(styles)(Post);
