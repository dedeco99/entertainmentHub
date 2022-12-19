import React, { useContext, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import { TVContext } from "../../contexts/TVContext";

import InfiniteScroll from "react-infinite-scroller";
import Banner from "./Banner";
import Loading from "../.partials/Loading";

const SERIES_PER_LOAD = 12;
function GroupBlock({ groupId }) {
	const { state } = useContext(TVContext);
	const { subscriptions } = state;
	const activeSubs = groupId === "all" ? subscriptions : subscriptions.filter(sub => sub.group.name === groupId);

	const [data, setData] = useState({
		itemsLoaded: 0,
		hasMore: false,
	});
	const loading = useRef(false);

	function loadMore() {
		if (!loading.current) {
			loading.current = true;
			setTimeout(() => {
				setData(prev => ({
					itemsLoaded: prev.itemsLoaded + SERIES_PER_LOAD,
					hasMore: prev.itemsLoaded + SERIES_PER_LOAD < activeSubs.length,
				}));
			}, 500);
			loading.current = false;
		}
	}

	useEffect(() => {
		setData({
			itemsLoaded: 0,
			hasMore: true,
		});
	}, [groupId]);

	if (!activeSubs.length) return <div />;

	return (
		<InfiniteScroll loadMore={loadMore} hasMore={data.hasMore} loader={<Loading key={0} />}>
			<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
				{activeSubs.slice(0, data.itemsLoaded).map(series => (
					<div key={series.externalId} style={{ padding: "8px" }}>
						<Banner series={series} contentType="tv" bannerWidth={180} actions />
					</div>
				))}
			</div>
		</InfiniteScroll>
	);
}

GroupBlock.propTypes = {
	groupId: PropTypes.string,
};

export default GroupBlock;
