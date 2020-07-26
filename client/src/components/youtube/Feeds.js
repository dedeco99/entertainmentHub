import React, { useContext, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import Feed from "./Feed";

import { WidgetContext } from "../../contexts/WidgetContext";
import { YoutubeContext } from "../../contexts/YoutubeContext";

import { getChannelGroups } from "../../api/channelGroups";

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

	function renderFeeds() {
		return channelGroups.map(channelGroup => (
			<div
				key={channelGroup._id}
				data-grid={{
					x: 0,
					y: 0,
					w: 1,
					h: 4,
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
		>
			{renderFeeds()}
		</ResponsiveGridLayout>
	);
}

export default Feeds;
