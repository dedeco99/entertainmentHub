import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import InfiniteScroll from "react-infinite-scroller";

import Loading from "../.partials/Loading";

import { getSearch } from "../../api/tv";
import Banner from "./Banner";

function Search({ query }) {
	const [data, setData] = useState({
		items: [],
		page: 0,
		hasMore: false,
	});
	const loading = useRef(false);

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
				{data.items.map(series => (
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
