import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import InfiniteScroll from "react-infinite-scroller";

import Zoom from "@material-ui/core/Zoom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chip from "@material-ui/core/Chip";
import Link from "@material-ui/core/Link";
import Badge from "@material-ui/core/Badge";

import { formatDate, htmlEscape } from "../../../utils/utils";

import { reddit as styles } from "../../../styles/Widgets";

import redditGold from "../../../img/gold_reddit.png";

const useStyles = makeStyles(styles);

function ListView({ open, subreddit, posts, multipleSubs, getPosts, hasMorePosts, onShowSingleView }) {
	const classes = useStyles();

	function renderLoadingMore() {
		return (
			<Box key={0} display="flex" alignItems="center" justifyContent="center">
				<CircularProgress />
			</Box>
		);
	}

	const postsList = posts.map((post, index) => (
		<ListItem key={post.id} button divider onClick={() => onShowSingleView(index)}>
			<Box display="flex" flex="1 1 auto" minWidth={0} flexDirection="column">
				<Box display="flex" flexWrap="wrap" className={classes.flairs}>
					{post.flairs.map(flair => (
						<Chip key={flair} size="small" label={flair} />
					))}
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
						loader={renderLoadingMore()}
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
