import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

import { makeStyles, List, ListItem, Typography, InputAdornment, Box } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import Banners from "./Banners";
import Input from "../.partials/Input";
import Loading from "../.partials/Loading";

import { TVContext } from "../../contexts/TVContext";

import { getSubscriptions } from "../../api/subscriptions";
import { getSearch, getPopular, getRecommendations } from "../../api/tv";

import { translate } from "../../utils/translations";

import { tv as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function Series({ contentType, bannerWidth, useWindowScroll, listView, widget }) {
	const classes = useStyles();
	const { state, dispatch } = useContext(TVContext);
	const { subscriptions } = state;
	const [filter, setFilter] = useState(widget ? "popular" : "subscriptions");
	const [popular, setPopular] = useState([]);
	const [popularHasMore, setPopularHasMore] = useState(true);
	const [popularPage, setPopularPage] = useState(0);
	const [popularLoading, setPopularLoading] = useState(false);
	const [recommendations, setRecommendations] = useState([]);
	const [recommendationsHasMore, setRecommendationsHasMore] = useState(true);
	const [recommendationsPage, setRecommendationsPage] = useState(0);
	const [recommendationsLoading, setRecommendationsLoading] = useState(false);
	const [search, setSearch] = useState([]);
	const [query, setQuery] = useState("");
	const [searchHasMore, setSearchHasMore] = useState(true);
	const [searchPage, setSearchPage] = useState(0);
	const [searchLoading, setSearchLoading] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			if (!loading) {
				setLoading(true);

				const response = await getSubscriptions("tv");

				if (response.status === 200 && isMounted) {
					dispatch({ type: "SET_SUBSCRIPTIONS", subscriptions: response.data });
				}

				setLoading(false);
			}
		}

		if (!subscriptions.length) fetchData();

		return () => (isMounted = false);
	}, []);

	useEffect(() => {
		setPopularPage(0);
		setPopular([]);
		setPopularHasMore(true);
	}, [contentType]);

	async function handleGetPopular() {
		if (!popularLoading) {
			setPopularLoading(true);

			const response = await getPopular(popularPage, "imdb", contentType);

			if (response.status === 200) {
				setPopular(prev => [...prev, ...response.data]);
				setPopularPage(prev => prev + 1);
				setPopularHasMore(!(response.data.length < 20));
			}

			setPopularLoading(false);
		}
	}

	async function handleGetRecommendations() {
		if (!recommendationsLoading) {
			setRecommendationsLoading(true);

			const response = await getRecommendations(recommendationsPage);

			if (response.status === 200) {
				setRecommendations(prev => [
					...prev,
					...response.data.filter(s => !prev.map(p => p.externalId).includes(s.externalId)),
				]);
				setRecommendationsPage(prev => prev + 1);
				setRecommendationsHasMore(!!response.data.length);
			}

			setRecommendationsLoading(false);
		}
	}

	async function handleGetSearch() {
		if (!searchLoading) {
			setSearchLoading(true);

			const response = await getSearch(query, searchPage);

			if (response.status === 200) {
				const newSearch = searchPage === 0 ? response.data : search.concat(response.data);

				setSearch(newSearch);
				setSearchPage(prev => prev + 1);
				setSearchHasMore(!(response.data.length < 20));
			}

			setSearchLoading(false);
		}
	}

	function handleSearch(e) {
		setQuery(e.target.value);
		setSearchPage(0);
	}

	function handleSubmit(e) {
		e.preventDefault();

		setFilter("search");

		handleGetSearch();
	}

	function handleFilterSeries(e, value) {
		if (value && value !== filter) {
			setFilter(value);
		}
	}

	function getFilterVariables() {
		const functionsMap = {
			popular: { series: popular, loadMore: handleGetPopular, hasMore: popularHasMore },
			recommendations: {
				series: recommendations,
				loadMore: handleGetRecommendations,
				hasMore: recommendationsHasMore,
			},
			search: { series: search, loadMore: handleGetSearch, hasMore: searchHasMore },
		};

		return functionsMap[filter];
	}

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

	function renderSeries() {
		return listView ? (
			<List>
				{(filter === "subscriptions" ? subscriptions : populateSeries(getFilterVariables().series)).map(serie => (
					<ListItem key={serie.externalId} button divider>
						<img src={serie.image} height="100x" alt="Series" />
						<Typography variant="body1" className={classes.popularText}>
							{serie.displayName}
						</Typography>
					</ListItem>
				))}
			</List>
		) : (
			<Banners
				series={filter === "subscriptions" ? subscriptions : populateSeries(getFilterVariables().series)}
				contentType={contentType}
				loading={popularLoading || recommendationsLoading || searchLoading}
				bannerWidth={bannerWidth}
			/>
		);
	}

	return (
		<div align="center">
			{!widget && (
				<Box display="flex" justifyContent="space-between" padding="0% 5%">
					<ToggleButtonGroup value={filter} onChange={handleFilterSeries} color="primary" size="small" exclusive>
						<ToggleButton value="subscriptions" className={classes.episodeBtn} color="primary" variant="outlined">
							{translate("subscriptions")}
						</ToggleButton>
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
					<form onSubmit={handleSubmit}>
						<Input
							id="search"
							label={translate("search")}
							value={query}
							onChange={handleSearch}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">{searchLoading && <Loading size={25} />}</InputAdornment>
								),
							}}
							size="small"
							variant="outlined"
							style={{ maxWidth: "200px" }}
						/>
					</form>
				</Box>
			)}
			{filter === "subscriptions" ? (
				renderSeries()
			) : (
				<InfiniteScroll
					loadMore={getFilterVariables().loadMore}
					hasMore={getFilterVariables().hasMore}
					loader={<Loading key={0} />}
					useWindow={useWindowScroll}
				>
					{renderSeries()}
				</InfiniteScroll>
			)}
		</div>
	);
}

Series.propTypes = {
	contentType: PropTypes.string.isRequired,
	bannerWidth: PropTypes.number.isRequired,
	useWindowScroll: PropTypes.bool.isRequired,
	listView: PropTypes.bool,
	widget: PropTypes.bool,
};

export default Series;
