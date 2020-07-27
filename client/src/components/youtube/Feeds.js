import React, { useContext, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import Feed from "./Feed";

import { WidgetContext } from "../../contexts/WidgetContext";
import { YoutubeContext } from "../../contexts/YoutubeContext";

import { getChannelGroups, editChannelGroup } from "../../api/channelGroups";

const ResponsiveGridLayout = WidthProvider(Responsive);

function Feeds() {
	const { widgetState } = useContext(WidgetContext);
	const { editMode } = widgetState;
	const { state, dispatch } = useContext(YoutubeContext);
	const { channelGroups } = state;

	useEffect(() => {
		async function fetchData() {
			const response = await getChannelGroups("youtube");

			if (response.data && response.data.length) {
				dispatch({ type: "SET_CHANNEL_GROUPS", channelGroups: response.data });
			}
		}

		fetchData();
	}, []); // eslint-disable-line

	async function handleEditFeed(updatedFeeds) {
		for (const updatedFeed of updatedFeeds) {
			const feedToUpdate = channelGroups.find(w => w._id === updatedFeed.i);

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

				const response = await editChannelGroup(feedToUpdate);

				if (response.status < 400) {
					dispatch({ type: "EDIT_CHANNEL_GROUP", channelGroup: response.data });
				}
			}
		}
	}

	function renderFeeds() {
		return channelGroups
			.sort((a, b) => a.y - b.y)
			.map(channelGroup => (
				<div
					key={channelGroup._id}
					data-grid={{
						x: channelGroup.x,
						y: channelGroup.y,
						w: channelGroup.width || 1,
						h: channelGroup.height || 4,
						minW: 1,
						minH: 4,
						maxW: 2,
						maxH: 8,
					}}
				>
					<Feed channelGroup={channelGroup} />
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

export default Feeds;
