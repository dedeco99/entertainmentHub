import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Responsive, WidthProvider } from "react-grid-layout";

import Feed from "./Feed";

import { WidgetContext } from "../../contexts/WidgetContext";
import { YoutubeContext } from "../../contexts/YoutubeContext";
import { RedditContext } from "../../contexts/RedditContext";

import { getFeeds, editFeed } from "../../api/feeds";

const ResponsiveGridLayout = WidthProvider(Responsive);

function Feeds({ platform }) {
	const { widgetState } = useContext(WidgetContext);
	const { editMode } = widgetState;
	const { state, dispatch } = useContext(platform === "youtube" ? YoutubeContext : RedditContext);
	const { feeds } = state;

	useEffect(() => {
		async function fetchData() {
			const response = await getFeeds(platform);

			if (response.status === 200) {
				dispatch({ type: "SET_FEEDS", feeds: response.data });
			}
		}

		fetchData();
	}, []); // eslint-disable-line

	async function handleEditFeed(updatedFeeds) {
		for (const updatedFeed of updatedFeeds) {
			const feedToUpdate = feeds.find(w => w._id === updatedFeed.i);

			if (
				feedToUpdate.x !== updatedFeed.x ||
				feedToUpdate.y !== updatedFeed.y ||
				feedToUpdate.width !== updatedFeed.w ||
				feedToUpdate.height !== updatedFeed.h
			) {
				feedToUpdate.x = updatedFeed.x;
				feedToUpdate.y = updatedFeed.y;
				feedToUpdate.width = updatedFeed.w;
				feedToUpdate.height = updatedFeed.h;

				const response = await editFeed(feedToUpdate);

				if (response.status < 400) {
					dispatch({ type: "EDIT_FEED", feed: response.data });
				}
			}
		}
	}

	function renderFeeds() {
		return feeds
			.sort((a, b) => a.y - b.y)
			.map(feed => (
				<div
					key={feed._id}
					data-grid={{
						x: feed.x,
						y: feed.y,
						w: feed.width || 1,
						h: feed.height || 4,
						/*
						minW: 1,
						minH: 4,
						maxW: 1,
						maxH: 7,
						*/
					}}
				>
					<Feed feed={feed} />
				</div>
			));
	}

	return (
		<ResponsiveGridLayout
			className="layout"
			breakpoints={{ xl: 1870, lg: 1230, md: 910, sm: 550, xs: 430, xxs: 0 }}
			cols={{ xl: 6, lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
			isDraggable={editMode}
			isResizable={editMode}
			compactType="horizontal"
			onDragStop={handleEditFeed}
			onResizeStop={handleEditFeed}
		>
			{renderFeeds()}
		</ResponsiveGridLayout>
	);
}

Feeds.propTypes = {
	platform: PropTypes.string.isRequired,
};

export default Feeds;
