import React, { useContext, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

import { makeStyles, List, ListItem, Typography, Box } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import Banner from "./Banner";
import Loading from "../.partials/Loading";

import { TVContext } from "../../contexts/TVContext";

import { getPopular, getRecommendations } from "../../api/tv";

import { tv as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function ExploreBlock({ contentType, bannerWidth, useWindowScroll, listView, widget }) {
	const classes = useStyles();
	const { state } = useContext(TVContext);
	const { subscriptions } = state;
	const [filter, setFilter] = useState("popular");
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

	async function fetchPopular() {
		if (!loading.current) {
			loading.current = true;
			const response = await getPopular(data.page, "imdb", contentType);

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

	async function fetchRecommendations() {
		if (!loading.current) {
			loading.current = true;
			const response = await getRecommendations(data.page);

			if (response.status === 200) {
				setData(prev => ({
					items: prev.items.concat(
						response.data.filter(s => !prev.items.map(p => p.externalId).includes(s.externalId)),
					),
					page: prev.page + 1,
					hasMore: !!response.data.length,
				}));
			}

			loading.current = false;
		}
	}

	const currentLoadFunc = {
		popular: fetchPopular,
		recommendations: fetchRecommendations,
	}[filter];

	function handleFilterSeries(e, value) {
		if (value && value !== filter) setFilter(value);
	}

	useEffect(() => {
		loading.current = false;
		setData({
			items: [],
			page: 0,
			hasMore: true,
		});
	}, [filter]);

	return (
		<div align="center">
			{!widget && (
				<Box display="flex" justifyContent="space-between" padding="0% 5%">
					<ToggleButtonGroup value={filter} onChange={handleFilterSeries} color="primary" size="small" exclusive>
						<ToggleButton value="popular" className={classes.episodeBtn} color="primary" variant="outlined">
							{"Popular"}
						</ToggleButton>
						<ToggleButton
							value="recommendations"
							className={classes.episodeBtn}
							color="primary"
							variant="outlined"
						>
							{"Recommendations"}
						</ToggleButton>
					</ToggleButtonGroup>
				</Box>
			)}
			<InfiniteScroll
				loadMore={currentLoadFunc}
				hasMore={data.hasMore}
				loader={<Loading key={0} />}
				useWindow={useWindowScroll}
			>
				{listView ? (
					<List>
						{populateSeries(data.items).map(item => (
							<ListItem key={item.externalId} button divider>
								<img src={item.image} height="100x" alt="Series" />
								<Typography variant="body1" className={classes.popularText}>
									{item.displayName}
								</Typography>
							</ListItem>
						))}
					</List>
				) : (
					<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
						{populateSeries(data.items).map(item => (
							<div key={item.externalId} style={{ padding: "8px" }}>
								<Banner series={item} contentType={contentType} bannerWidth={bannerWidth} />
							</div>
						))}
					</div>
				)}
			</InfiniteScroll>
		</div>
	);
}

ExploreBlock.propTypes = {
	contentType: PropTypes.string.isRequired,
	bannerWidth: PropTypes.number.isRequired,
	useWindowScroll: PropTypes.bool.isRequired,
	listView: PropTypes.bool,
	widget: PropTypes.bool,
};

export default ExploreBlock;
