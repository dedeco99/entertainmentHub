import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { TVContext } from "../../contexts/TVContext";

import InfiniteScroll from "react-infinite-scroller";

import Loading from "../.partials/Loading";

import { getSearch } from "../../api/tv";
import Banner from "./Banner";

function SearchBlock({ query }) {
	const { state } = useContext(TVContext);
	const { subscriptions } = state;
	const [data, setData] = useState({
		items: [],
		page: 0,
		hasMore: false,
	});
	const loading = useRef(false);

	function populateSeries(series) {
		for (const serie of series) {
			const subscriptionFound = subscriptions.find(s => s.externalId === serie.externalId);

			if (subscriptionFound) {
				serie.numTotal = subscriptionFound.numTotal;
				serie.numWatched = subscriptionFound.numWatched;
				serie.numToWatch = subscriptionFound.numToWatch;
			} else {
				serie.numTotal = 0;
				serie.numWatched = 0;
				serie.numToWatch = 0;
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
				{populateSeries(data.items).map(serie => (
					<div key={serie.externalId} style={{ padding: "8px" }}>
						<Banner serie={serie} contentType="tv" bannerWidth={180} />
					</div>
				))}
			</div>
		</InfiniteScroll>
	);
}

SearchBlock.propTypes = {
	query: PropTypes.string,
};

export default SearchBlock;
