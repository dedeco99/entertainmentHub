import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

import Loading from "../.partials/Loading";
import Banner from "./Banner";

import { TVContext } from "../../contexts/TVContext";

import { getSubscriptions } from "../../api/subscriptions";

function Group({ group }) {
	const { state, dispatch } = useContext(TVContext);
	const { subscriptions } = state;
	const defaultData = {
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
					page: prev.page + 1,
					hasMore: subscriptions.length + response.data.subscriptions.length < response.data.total,
				}));

				dispatch({ type: "SET_SUBSCRIPTIONS", subscriptions: subscriptions.concat(response.data.subscriptions) });
			}

			loading.current = false;
		}
	}

	useEffect(() => {
		setData(defaultData);
		dispatch({ type: "SET_SUBSCRIPTIONS", subscriptions: [] });
	}, [group]);

	return (
		<InfiniteScroll loadMore={handleGetSubscriptions} hasMore={data.hasMore} loader={<Loading key={0} />}>
			{subscriptions.length ? (
				<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
					{subscriptions.map(series => (
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
