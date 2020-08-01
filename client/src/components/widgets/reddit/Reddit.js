import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Loading from "../../.partials/Loading";
import SingleView from "./SingleView";
import ListView from "./ListView";

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

	async function getPostsCall() {
		if (!loading) {
			setLoading(true);

			let response = null;
			if (search) {
				response = await getSearch(subreddit, search, pagination.after);
			} else {
				response = await getPosts(subreddit, pagination.after);
			}

			if (response.status === 200) {
				response.data = response.data.filter(post => !post.stickied);
				const newPosts = pagination.page === 0 ? response.data : posts.concat(response.data);

				setPosts(newPosts);
				setPagination({
					page: pagination.page + 1,
					after: response.data[response.data.length - 1].after,
					hasMore: !(response.data.length < 25),
				});
				setLoading(false);
				setOpen(true);
			}
		}
	}

	useEffect(() => {
		async function fetchData() {
			await getPostsCall();

			setShowListView(listView);
		}

		fetchData();
	}, []); // eslint-disable-line

	function handleShowPreviousPost() {
		if (num > 0) setNum(num - 1);
	}

	async function handleShowNextPost() {
		if (num === posts.length - 2) await getPostsCall();
		if (num < posts.length - 1) setNum(num + 1);
	}

	function handleShowListView() {
		setShowListView(true);
	}

	function handleShowSingleView(position) {
		setShowListView(false);
		setNum(position);
	}

	function renderListView() {
		return (
			<ListView
				open={open}
				subreddit={subreddit}
				posts={posts}
				multipleSubs={subreddit.includes("+")}
				getPosts={getPostsCall}
				hasMorePosts={pagination.hasMore}
				onShowSingleView={handleShowSingleView}
			/>
		);
	}

	function renderSingleView() {
		return (
			<SingleView
				open={open}
				post={posts[num]}
				multipleSubs={subreddit.includes("+")}
				onShowNextPost={handleShowNextPost}
				onShowPreviousPost={handleShowPreviousPost}
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
