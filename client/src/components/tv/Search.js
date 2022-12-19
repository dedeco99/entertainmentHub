import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { TVContext } from "../../contexts/TVContext";

import InfiniteScroll from "react-infinite-scroller";

import Loading from "../.partials/Loading";

import { getSearch } from "../../api/tv";
import Banner from "./Banner";

function Search({ query }) {
	const { state } = useContext(TVContext);
	const { subscriptions } = state;
	const [data, setData] = useState({
		items: [],
		page: 0,
		hasMore: false,
	});
	const loading = useRef(false);

	function populateSeries(series) {
		for (const s of series) {
			const subscriptionFound = subscriptions.find(subscription => subscription.externalId === s.externalId);

			if (subscriptionFound) {
				s.numTotal = subscriptionFound.numTotal;
				s.numWatched = subscriptionFound.numWatched;
				s.numToWatch = subscriptionFound.numToWatch;
			} else {
				s.numTotal = 0;
				s.numWatched = 0;
				s.numToWatch = 0;
			}
		}

		return series;
	}

	async function handleGetSearch() {
		if (!loading.current) {
			loading.current = true;

			const response = await getSearch(query, data.page);

			if (response.status === 200) {
				setData(prev => ({
					items: prev.items.concat(response.data),
					page: prev.page + 1,
					hasMore: !(response.data.length < 20),
				}));
			}

			loading.current = false;
		}
	}

	useEffect(() => {
		loading.current = false;
		setData({
			items: [],
			page: 0,
			hasMore: true,
		});
	}, [query]);

	return (
		<InfiniteScroll loadMore={handleGetSearch} hasMore={data.hasMore} loader={<Loading key={0} />}>
			<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
				{populateSeries(data.items).map(series => (
					<div key={series.externalId} style={{ padding: "8px" }}>
						<Banner series={series} contentType="tv" bannerWidth={180} />
					</div>
				))}
			</div>
		</InfiniteScroll>
	);
}

Search.propTypes = {
	query: PropTypes.string,
};

export default Search;
