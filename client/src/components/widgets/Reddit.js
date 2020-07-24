import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import InfiniteScroll from "react-infinite-scroller";

import Zoom from "@material-ui/core/Zoom";
import CardMedia from "@material-ui/core/CardMedia";
import Box from "@material-ui/core/Box";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Chip from "@material-ui/core/Chip";
import Link from "@material-ui/core/Link";
import CircularProgress from "@material-ui/core/CircularProgress";
import Badge from "@material-ui/core/Badge";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";

import { getPosts, getSearch } from "../../api/reddit";
import { formatDate } from "../../utils/utils";

import { reddit as styles } from "../../styles/Widgets";

import redditGold from "../../img/gold_reddit.png";

class Reddit extends Component {
	constructor() {
		super();
		this.state = {
			posts: [],
			after: null,
			page: 0,
			hasMorePosts: false,
			multipleSubs: false,

			num: 0,

			open: false,
			expandedView: false,
			showListView: true,
		};

		this.getPosts = this.getPosts.bind(this);

		this.handleShowPreviousPost = this.handleShowPreviousPost.bind(this);
		this.handleShowNextPost = this.handleShowNextPost.bind(this);

		this.handleCloseExpandedView = this.handleCloseExpandedView.bind(this);
		this.handleOpenExpandedView = this.handleOpenExpandedView.bind(this);

		this.handleShowListView = this.handleShowListView.bind(this);
		this.handleCheckPost = this.handleCheckPost.bind(this);
	}

	async componentDidMount() {
		this.hasMultipleSubs();
		await this.getPosts();
	}

	hasMultipleSubs() {
		const { subreddit, listView } = this.props;

		this.setState({ multipleSubs: subreddit.includes("+"), showListView: listView });
	}

	async getPosts() {
		const { subreddit, search } = this.props;
		const { posts, page, after } = this.state;

		let response = null;
		if (search) {
			response = await getSearch(subreddit, search, after);
		} else {
			response = await getPosts(subreddit, after);
		}

		if (response.data) {
			response.data = response.data.filter(post => !post.stickied);
			const newPosts = page === 0 ? response.data : posts.concat(response.data);

			this.setState({
				posts: newPosts,
				page: page + 1,
				after: response.data[response.data.length - 1].after,
				hasMorePosts: !(response.data.length < 25),
				open: true,
			});
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

	async handleShowNextPost() {
		const { num, posts } = this.state;

		if (num === posts.length - 2) await this.getPosts();
		if (num < posts.length - 1) this.setState({ num: num + 1 });
	}

	handleCloseExpandedView() {
		this.setState({ expandedView: false });
	}

	handleOpenExpandedView() {
		this.setState({ expandedView: true });
	}

	handleShowListView() {
		this.setState({ showListView: true });
	}

	handleCheckPost(position) {
		this.setState({ showListView: false, num: position });
	}

	renderLoadingMore() {
		return (
			<Box key={0} display="flex" alignItems="center" justifyContent="center">
				<CircularProgress />
			</Box>
		);
	}

	renderListView() {
		const { classes, subreddit } = this.props;
		const { open, posts, hasMorePosts, multipleSubs } = this.state;

		const postsList = posts.map((post, index) => (
			<ListItem key={post.id} button divider onClick={() => this.handleCheckPost(index)}>
				<Box display="flex" flex="1 1 auto" minWidth={0} flexDirection="column">
					<Box display="flex" flexWrap="wrap" className={classes.flairs}>
						{post.flairs.map(flair => <Chip key={flair} size="small" label={flair} />)}
					</Box>
					<Box display="flex">
						<Box display="flex" flexDirection="column" flexGrow={1}>
							<Typography display="block" title={post.title} variant="body1">
								{this.htmlEscape(post.title)}
							</Typography>
						</Box>
						{post.gilded > 0 && (
							<Box display="flex" p={1}>
								{post.gilded > 1 ? (
									<Badge badgeContent={post.gilded} color="error" classes={{ badge: classes.gildedBadge }}>
										<img src={redditGold} height={16} width={16} alt="reddit gold" />
									</Badge>
								) : <img src={redditGold} height={16} width={16} alt="reddit gold" />}
							</Box>
						)}
					</Box>
					{multipleSubs ? (
						<Typography display="inline" title={post.subreddit} variant="caption">
							{`r/${post.subreddit} • ${formatDate(post.created * 1000, null, true)}`}
						</Typography>
					) : (
						<Typography display="inline" variant="caption">
							{formatDate(post.created * 1000, null, true)}
						</Typography>
					)}
				</Box>
			</ListItem>
		));

		return (
			<Zoom in={open}>
				<Box display="flex" flexDirection="column" className={classes.singleWrapper}>
					<Box display="flex" className={classes.singleHeader} alignItems="center">
						<Typography variant="subtitle1">
							<Link href={`https://reddit.com/r/${subreddit}`} target="_blank" rel="noreferrer" color="inherit">
								{`r/${subreddit}`}
							</Link>
						</Typography>
					</Box>
					<Box display="flex" flexGrow={1} className={classes.singleContent}>
						<InfiniteScroll
							initialLoad={false}
							loadMore={this.getPosts}
							hasMore={hasMorePosts}
							useWindow={false}
							loader={this.renderLoadingMore()}
						>
							<List>{postsList}</List>
						</InfiniteScroll>
					</Box>
				</Box>
			</Zoom>
		);
	}

	// eslint-disable-next-line max-lines-per-function,complexity
	renderSingleView() {
		const { classes } = this.props;
		const { posts, num, open, expandedView, multipleSubs } = this.state;

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
					onClick={this.handleOpenExpandedView}
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
						<Box display="flex" flexDirection="column">
							{multipleSubs && (
								<Typography variant="caption">
									<Link href={`https://reddit.com/r/${post.subreddit}`} target="_blank" rel="noreferrer" color="inherit">
										{`r/${post.subreddit}`}
									</Link>
								</Typography>
							)}
							<Typography variant="h6">
								<Link href={post.permalink} target="_blank" rel="noreferrer" color="inherit">
									{this.htmlEscape(post.title)}
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
								<Typography variant="caption">
									{formatDate(post.created * 1000, null, true)}
								</Typography>
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
							<div
								className={classes.textContent}
								dangerouslySetInnerHTML={{ __html: this.htmlEscape(post.text) }}
							/>
						)}
					</Box>
				</Box >
			);
		}

		const info_v1 = (
			<div>
				<div
					className={`${classes.overlay} ${classes.title}`}
					title={post.title}
				>
					<Typography>
						<Link href={post.permalink} target="_blank" rel="noreferrer" color="inherit">
							{this.htmlEscape(post.title)}
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
				<div className={`${classes.overlay} ${classes.date}`}>
					{formatDate(post.created * 1000, null, true)}
				</div>
			</div >
		);

		const info_v2 = (
			<Box>
				<Divider />
				<Box p={1}>
					<Typography>
						<Link href={post.permalink} target="_blank" rel="noreferrer" color="inherit">
							{this.htmlEscape(post.title)}
						</Link>
					</Typography>
					{multipleSubs && (
						<Typography variant="caption" title={post.subreddit}>
							<Link href={`https://reddit.com/r/${post.subreddit}`} target="_blank" rel="noreferrer" color="inherit">
								{`r/${post.subreddit}`}
							</Link>
						</Typography>
					)}
					<Box display="flex" flexWrap="wrap" className={classes.flairs}>
						{post.flairs.map(flair => <Chip key={flair} size="small" label={flair} />)}
					</Box>
					<Box display="flex">
						<Box flexGrow={1}>
							<i className="icofont-caret-up" />
							{post.score}
							<i className="icofont-caret-down" />
						</Box>
						<Box flexGrow={1}>
							<i className="icofont-comment" />
							{` ${post.comments}`}
						</Box>
						<Box flexGrow={1}>
							<Typography variant="caption">
								{formatDate(post.created * 1000, null, true)}
							</Typography>
						</Box>
					</Box>
				</Box>
			</Box>
		);

		return (
			<Zoom in={open}>
				<Box
					variant="outlined"
					className={classes.root}
				>
					<Box display="flex" flexDirection="column" className={classes.wrapper}>
						<Modal
							className={classes.modal}
							open={expandedView}
							onClose={this.handleCloseExpandedView}
							closeAfterTransition
						>
							<Fade in={expandedView}>
								<Paper component={Box} position="relative" className={classes.expandedView}>
									<Box position="absolute" top="0px" left="0px" className={classes.expandedBtn} onClick={this.handleShowPreviousPost}>
										<Box display="flex" alignItems="center" height="100%">
											<i className="icofont-arrow-left icofont-3x" />
										</Box>
									</Box>
									{expandedContent}
									<Box position="absolute" top="0px" right="0px" className={classes.expandedBtn} onClick={this.handleShowNextPost}>
										<Box display="flex" alignItems="center" height="100%">
											<i className="icofont-arrow-right icofont-3x" />
										</Box>
									</Box>
								</Paper>
							</Fade>
						</Modal>
						<Box
							display="flex"
							flexDirection="column"
							flexGrow={1}
							className={classes.content}
						>
							{content}
							{isMedia && info_v2}
						</Box>
						<Box display="flex" className={classes.arrows}>
							<Box
								display="flex"
								flex="1"
								justifyContent="center"
								alignItems="center"
								onClick={this.handleShowPreviousPost}
							>
								<i className="icofont-caret-left" />
							</Box>
							<Box display="flex" onClick={this.handleShowListView} className={classes.header}>
								<i className="icofont-listing-box" />
							</Box>
							<Box
								display="flex"
								flex="1"
								justifyContent="center"
								alignItems="center"
								onClick={this.handleShowNextPost}
							>
								<i className="icofont-caret-right" />
							</Box>
						</Box>
					</Box>
				</Box>
			</Zoom>
		);
	}

	render() {
		const { posts, showListView } = this.state;

		if (!posts || !posts.length) return null;

		return (showListView ? this.renderListView() : this.renderSingleView());
	}
}

Reddit.propTypes = {
	classes: PropTypes.object.isRequired,
	subreddit: PropTypes.string.isRequired,
	search: PropTypes.string,
	listView: PropTypes.bool,
};

export default withStyles(styles)(Reddit);
