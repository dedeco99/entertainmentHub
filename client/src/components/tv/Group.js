import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

import Loading from "../.partials/Loading";
import Banner from "./Banner";

import { getSubscriptions } from "../../api/subscriptions";

function Group({ group }) {
	const defaultData = {
		subscriptions: [],
		page: 0,
		perPage: 20,
		sortBy: "displayName",
		sortDesc: false,
		hasMore: true,
	};
	const [data, setData] = useState(defaultData);
	const loading = useRef(false);

	async function handleGetSubscriptions() {
		if (!loading.current) {
			loading.current = true;

			const response = await getSubscriptions(
				"tv",
				data.page,
				data.perPage,
				data.sortBy,
				data.sortDesc,
				group === "all" ? null : group,
			);

			if (response.status === 200) {
				setData(prev => ({
					...defaultData,
					subscriptions: prev.subscriptions.concat(response.data.subscriptions),
					page: prev.page + 1,
					hasMore: prev.subscriptions.length + response.data.subscriptions.length < response.data.total,
				}));
			}

			loading.current = false;
		}
	}

	useEffect(() => {
		setData(defaultData);
	}, [group]);

	return (
		<InfiniteScroll loadMore={handleGetSubscriptions} hasMore={data.hasMore} loader={<Loading key={0} />}>
			{data.subscriptions.length ? (
				<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
					{data.subscriptions.slice(0, data.itemsLoaded).map(series => (
						<div key={series.externalId} style={{ padding: "8px" }}>
							<Banner series={series} contentType="tv" bannerWidth={180} actions />
						</div>
					))}
				</div>
			) : null}
		</InfiniteScroll>
	);
}

Group.propTypes = {
	group: PropTypes.string,
};

export default Group;
