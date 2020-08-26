import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Masonry from "react-masonry-css";
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
	const [callApi, setCallApi] = useState(true);
	const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const categoryOptions = ["Hot", "New", "Best", "Rising", "Controversial", "Top"];

	async function handleGetPosts() {
		if (!loading) {
			setLoading(true);

			if (pagination.page === 0) setOpen(false);

			const response = await getPosts(match.params.sub, match.params.category, pagination.after);

			if (response.status === 200) {
				const newPosts = pagination.page === 0 ? response.data : posts.concat(response.data);

				setPosts(newPosts);
				setPagination({
					page: pagination.page + 1,
					hasMore: !(response.data.length < 25),
					after: response.data.length ? response.data[0].after : null,
				});
				setLoading(false);
				setOpen(true);
			}
		}
	}

	useEffect(() => {
		if (categoryOptions.map(c => c.toLowerCase()).includes(match.params.category)) {
			setPagination({ page: 0, hasMore: false, after: null });
		} else {
			history.push(`/reddit/${match.params.sub}/hot`);
		}

		setCallApi(!callApi);
	}, [match.url]); // eslint-disable-line

	useEffect(() => {
		async function fetchData() {
			await handleGetPosts();
		}

		fetchData();
	}, [callApi]); // eslint-disable-line

	function applyCategory(category) {
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
						endIcon={<i className="icon-filter" />}
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
						<Masonry
							breakpointCols={{
								default: 5,
								1920: 4,
								1500: 3,
								1280: 2,
								960: 1,
								600: 1,
							}}
							className={classes.masonryRoot}
							columnClassName={classes.masonryColumn}
						>
							{posts.map(post => (
								<Box
									key={post.id}
									variant="outlined"
									display="flex"
									flexDirection="column"
									className={classes.root}
								>
									<Post
										post={post}
										multipleSubs={match.params.sub.includes("+")}
										inList
										customStyles={{ borderRadius: 3 }}
									/>
								</Box>
							))}
						</Masonry>
					</InfiniteScroll>
				</Grid>
			</Grid>
		);
	}

	if (!open) return <Loading />;

	return renderPosts();
}

export default Posts;
