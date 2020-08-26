import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useRouteMatch } from "react-router-dom";

import { makeStyles, Grid, Box } from "@material-ui/core";

import Loading from "../.partials/Loading";
import Post from "./Post";

import { getPosts } from "../../api/reddit";

import { posts as styles } from "../../styles/Reddit";

const useStyles = makeStyles(styles);

function Posts() {
	const match = useRouteMatch();
	const classes = useStyles();
	const [posts, setPosts] = useState([]);
	const [pagination, setPagination] = useState({
		page: 0,
		hasMore: false,
		after: null,
	});
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	let isMounted = true;

	async function handleGetPosts() {
		if (!loading) {
			setLoading(true);

			if (pagination.page === 0) setOpen(false);

			const response = await getPosts(match.params.sub, pagination.after);

			if (response.status === 200 && isMounted) {
				const newPosts = pagination.page === 0 ? response.data : posts.concat(response.data);

				setPosts(newPosts);
				setPagination({
					page: pagination.page + 1,
					hasMore: !(response.data.length < 25),
					after: response.data.length ? response.data[0].after : null,
				});
				setLoading(false);
				if (pagination.page === 0) setOpen(true);
			}
		}
	}

	useEffect(() => {
		async function fetchData() {
			await handleGetPosts();
		}

		fetchData();

		return () => (isMounted = false); // eslint-disable-line
	}, [match.url]); // eslint-disable-line

	function renderPosts() {
		return posts.map(post => (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={post.id}>
				<Box variant="outlined" display="flex" flexDirection="column" className={classes.root}>
					<Post post={post} multipleSubs={match.params.sub.includes("+")} inList />
				</Box>
			</Grid>
		));
	}

	function renderAllEpisodes() {
		return (
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<InfiniteScroll loadMore={handleGetPosts} hasMore={pagination.hasMore} loader={<Loading key={0} />}>
						<Grid container spacing={2}>
							{renderPosts()}
						</Grid>
					</InfiniteScroll>
				</Grid>
			</Grid>
		);
	}

	if (!open) return <Loading />;

	return renderAllEpisodes();
}

export default Posts;
