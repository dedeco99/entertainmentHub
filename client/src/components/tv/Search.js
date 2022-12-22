import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import Loading from "../.partials/Loading";
import Banner from "./Banner";

import { getSearch } from "../../api/tv";

import { translate } from "../../utils/translations";

function Search({ query }) {
	const [contentType, setContentType] = useState("tv");
	const [data, setData] = useState({
		items: [],
		page: 0,
		hasMore: false,
	});
	const loading = useRef(false);

	async function handleGetSearch() {
		if (!loading.current) {
			loading.current = true;

			const response = await getSearch(query, data.page, contentType);

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

	function handleChangeContentType(e, value) {
		if (value && value !== contentType) setContentType(value);
	}

	useEffect(() => {
		loading.current = false;
		setData({
			items: [],
			page: 0,
			hasMore: true,
		});
	}, [query, contentType]);

	return (
		<>
			<ToggleButtonGroup
				value={contentType}
				onChange={handleChangeContentType}
				color="primary"
				size="small"
				exclusive
			>
				<ToggleButton value="tv" color="primary" variant="outlined">
					{translate("tv")}
				</ToggleButton>
				<ToggleButton value="movie" color="primary" variant="outlined">
					{translate("movies")}
				</ToggleButton>
			</ToggleButtonGroup>
			<InfiniteScroll loadMore={handleGetSearch} hasMore={data.hasMore} loader={<Loading key={0} />}>
				<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
					{data.items.map(series => (
						<div key={series.externalId} style={{ padding: "8px" }}>
							<Banner series={series} contentType={contentType} bannerWidth={180} />
						</div>
					))}
				</div>
			</InfiniteScroll>
		</>
	);
}

Search.propTypes = {
	query: PropTypes.string,
};

export default Search;
