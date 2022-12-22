import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

import { makeStyles, List, ListItem, Typography, Box } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import Banner from "./Banner";
import Loading from "../.partials/Loading";

import { getPopular, getRecommendations } from "../../api/tv";

import { translate } from "../../utils/translations";

import { tv as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function Explore({ bannerWidth, useWindowScroll, listView }) {
	const classes = useStyles();
	const [type, setType] = useState("popular");
	const [contentType, setContentType] = useState("tv");
	const [data, setData] = useState({
		items: [],
		page: 0,
		hasMore: false,
	});
	const loading = useRef(false);

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
			const response = await getRecommendations(data.page, contentType);

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
	}[type];

	function handleChangeType(e, value) {
		if (value && value !== type) setType(value);
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
	}, [type, contentType]);

	return (
		<div align="center">
			<Box style={{ display: "flex", gap: "20px" }} padding="0% 5%">
				<ToggleButtonGroup value={type} onChange={handleChangeType} color="primary" size="small" exclusive>
					<ToggleButton value="popular" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("popular")}
					</ToggleButton>
					<ToggleButton value="recommendations" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("recommendations")}
					</ToggleButton>
				</ToggleButtonGroup>
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
			</Box>
			<InfiniteScroll
				loadMore={currentLoadFunc}
				hasMore={data.hasMore}
				loader={<Loading key={0} />}
				useWindow={useWindowScroll}
			>
				{listView ? (
					<List>
						{data.items.map(item => (
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
						{data.items.map(item => (
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

Explore.propTypes = {
	bannerWidth: PropTypes.number.isRequired,
	useWindowScroll: PropTypes.bool.isRequired,
	listView: PropTypes.bool,
};

export default Explore;
