import React from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

import { makeStyles, Zoom, Box, Typography, List, ListItem, Chip, Link, Badge } from "@material-ui/core";

import Loading from "../../.partials/Loading";

import { formatDate, htmlEscape } from "../../../utils/utils";

import { reddit as styles } from "../../../styles/Widgets";

import redditGold from "../../../img/gold_reddit.png";

const useStyles = makeStyles(styles);

function ListView({ open, subreddit, posts, multipleSubs, getPosts, hasMorePosts, onShowSingleView }) {
	const classes = useStyles();

	const postsList = posts.map((post, index) => (
		<ListItem key={post.id} button divider onClick={() => onShowSingleView(index)}>
			<Box display="flex" flex="1 1 auto" minWidth={0} flexDirection="column">
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
				<Box display="flex">
					<Box display="flex" flexDirection="column" flexGrow={1}>
						<Typography display="block" title={post.title} variant="body1">
							{htmlEscape(post.title)}
						</Typography>
					</Box>
					{post.gilded > 0 && (
						<Box display="flex" p={1}>
							{post.gilded > 1 ? (
								<Badge badgeContent={post.gilded} color="error" classes={{ badge: classes.gildedBadge }}>
									<img src={redditGold} height={16} width={16} alt="reddit gold" />
								</Badge>
							) : (
								<img src={redditGold} height={16} width={16} alt="reddit gold" />
							)}
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
						loadMore={getPosts}
						hasMore={hasMorePosts}
						useWindow={false}
						loader={<Loading key={0} />}
						style={{ width: "100%" }}
					>
						<List>{postsList}</List>
					</InfiniteScroll>
				</Box>
			</Box>
		</Zoom>
	);
}

ListView.propTypes = {
	open: PropTypes.bool.isRequired,
	subreddit: PropTypes.string.isRequired,
	posts: PropTypes.array.isRequired,
	multipleSubs: PropTypes.bool.isRequired,
	getPosts: PropTypes.func.isRequired,
	hasMorePosts: PropTypes.bool.isRequired,
	onShowSingleView: PropTypes.func.isRequired,
};

export default ListView;
