import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles, Grid, Box, Button, Menu, MenuItem } from "@material-ui/core";

import Loading from "../.partials/Loading";
import Post from "./Post";

import { getPosts } from "../../api/reddit";

import { posts as styles } from "../../styles/Reddit";

const useStyles = makeStyles(styles);

function Posts() {
	const history = useHistory();
	const match = useRouteMatch();
	const classes = useStyles();
	const [posts, setPosts] = useState([]);
	const [pagination, setPagination] = useState({
		page: 0,
		hasMore: false,
		after: null,
	});
	const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const categoryOptions = ["Hot", "New", "Best", "Rising", "Controversial", "Top"];
	let isMounted = true;

	async function handleGetPosts() {
		if (!loading) {
			setLoading(true);

			if (pagination.page === 0) setOpen(false);

			const response = await getPosts(match.params.sub, match.params.category, pagination.after);

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
			if (categoryOptions.map(c => c.toLowerCase()).includes(match.params.category)) {
				await handleGetPosts();
			} else {
				setPosts([]);
				setPagination({ page: 0, hasMore: false, after: null });

				history.push(`/reddit/${match.params.sub}/hot`);
			}
		}

		fetchData();

		return () => (isMounted = false); // eslint-disable-line
	}, [match.url]); // eslint-disable-line

	function applyCategory(category) {
		setPagination({ ...pagination, page: 0, after: null });

		history.push(`/reddit/${match.params.sub}/${category}`);
	}

	function handleClickListItem(e) {
		setCategoryAnchorEl(e.currentTarget);
	}

	function handleMenuItemClick(e) {
		setCategoryAnchorEl(null);

		applyCategory(e.currentTarget.id);
	}

	function handleClose() {
		setCategoryAnchorEl(null);
	}

	function renderPosts() {
		const selectedIndex = categoryOptions.findIndex(o => o.toLowerCase() === match.params.category);

		return (
			<Grid container spacing={2}>
				<Grid item xs={0} sm={10} />
				<Grid item xs={12} sm={2}>
					<Button
						size="small"
						aria-controls="category-menu"
						aria-haspopup="true"
						onClick={handleClickListItem}
						endIcon={<i className="material-icons">{"filter_list"}</i>}
						style={{ float: "right" }}
					>
						{categoryOptions[selectedIndex]}
					</Button>
					<Menu
						id="category-menu"
						anchorEl={categoryAnchorEl}
						keepMounted
						open={Boolean(categoryAnchorEl)}
						onClose={handleClose}
						getContentAnchorEl={null}
						anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
						transformOrigin={{ vertical: "top", horizontal: "right" }}
					>
						{categoryOptions.map((option, index) => (
							<MenuItem
								key={option}
								id={option.toLowerCase()}
								selected={index === selectedIndex}
								onClick={handleMenuItemClick}
							>
								{option}
							</MenuItem>
						))}
					</Menu>
				</Grid>
				<Grid item xs={12}>
					<InfiniteScroll loadMore={handleGetPosts} hasMore={pagination.hasMore} loader={<Loading key={0} />}>
						<Grid container spacing={2}>
							{posts.map(post => (
								<Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={post.id}>
									<Box variant="outlined" display="flex" flexDirection="column" className={classes.root}>
										<Post post={post} multipleSubs={match.params.sub.includes("+")} inList />
									</Box>
								</Grid>
							))}
						</Grid>
					</InfiniteScroll>
				</Grid>
			</Grid>
		);
	}

	if (!open) return <Loading />;

	return renderPosts();
}

export default Posts;
