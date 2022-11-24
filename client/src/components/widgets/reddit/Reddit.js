import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

import Loading from "../../.partials/Loading";
import SingleView from "../../.partials/SingleView";
import ListView from "./ListView";
import Post from "../../reddit/Post";

import { getPosts, getSearch } from "../../../api/reddit";

function Reddit({ subreddit, search, listView }) {
	const [posts, setPosts] = useState([]);
	const [pagination, setPagination] = useState({
		page: 0,
		after: null,
		hasMore: false,
	});
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [showListView, setShowListView] = useState(true);
	const [num, setNum] = useState(0);
	const [scrollTop, setScrollTop] = useState(0);
	const postListRef = useRef(0);
	let isMounted = true;

	async function handleGetPosts() {
		if (!loading) {
			setLoading(true);

			let response = null;
			if (search) {
				response = await getSearch(subreddit, search, pagination.after);
			} else {
				response = await getPosts(subreddit, "hot", pagination.after);
			}

			if (response.status === 200 && isMounted) {
				response.data = response.data.filter(post => !post.stickied);
				const newPosts = pagination.page === 0 ? response.data : posts.concat(response.data);

				setPosts(newPosts);
				setPagination({
					page: pagination.page + 1,
					after: response.data.length ? response.data[0].after : null,
					hasMore: !(response.data.length < 25),
				});
				setLoading(false);
				setOpen(true);
			}
		}
	}

	useEffect(() => {
		async function fetchData() {
			await handleGetPosts();

			if (isMounted) setShowListView(listView);
		}

		fetchData();

		return () => (isMounted = false);
	}, []);

	function handleShowPreviousPost() {
		if (num > 0) setNum(num - 1);
	}

	async function handleShowNextPost() {
		if (num === posts.length - 2) await handleGetPosts();
		if (num < posts.length - 1) setNum(num + 1);
	}

	function handleShowListView() {
		setShowListView(true);

		setTimeout(() => {
			postListRef.current.scrollTo({ top: scrollTop });
		}, 100);
	}

	function handleShowSingleView(position) {
		setShowListView(false);
		setNum(position);
		setScrollTop(postListRef.current.scrollTop);
	}

	function renderListView() {
		return (
			<ListView
				open={open}
				subreddit={subreddit}
				posts={posts}
				postListRef={postListRef}
				multipleSubs={subreddit.includes("+") || subreddit === "all"}
				getPosts={handleGetPosts}
				hasMorePosts={pagination.hasMore}
				onShowSingleView={handleShowSingleView}
			/>
		);
	}

	function renderSingleView() {
		return (
			<SingleView
				open={open}
				content={
					<Post
						post={posts[num]}
						num={num}
						multipleSubs={subreddit.includes("+") || subreddit === "all"}
						onShowPreviousPost={handleShowPreviousPost}
						onShowNextPost={handleShowNextPost}
					/>
				}
				onShowPrevious={handleShowPreviousPost}
				onShowNext={handleShowNextPost}
				onShowListView={handleShowListView}
			/>
		);
	}

	if (!open) return <Loading />;

	return showListView ? renderListView() : renderSingleView();
}

Reddit.propTypes = {
	subreddit: PropTypes.string.isRequired,
	search: PropTypes.string,
	listView: PropTypes.bool,
};

export default Reddit;
