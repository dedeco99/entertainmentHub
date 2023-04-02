import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

import { makeStyles, Grid } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import Loading from "../.partials/Loading";
import Episode from "./Episode";
import Banner from "./Banner";

import { getEpisodes } from "../../api/tv";
import { translate } from "../../utils/translations";

import { episodes as styles } from "../../styles/TV";

const useStyles = makeStyles(styles);

function Feed() {
	const classes = useStyles();
	const [data, setData] = useState({
		episodes: [],
		page: 0,
		hasMore: false,
		triedToFetch: false,
	});
	const [filter, setFilter] = useState("passed");
	const [contentType, setContentType] = useState("tv");

	async function handleGetAll() {
		const response = await getEpisodes(contentType, "all", null, data.page, filter);

		if (response.status === 200) {
			setData(prev => ({
				episodes: prev.episodes.concat(response.data),
				page: prev.page + 1,
				hasMore: !(response.data.length < (contentType === "movie" ? 25 : 50)),
				triedToFetch: true,
			}));
		}
	}

	function handleFilterEpisodes(e, value) {
		if (value && value !== filter) setFilter(value);
	}

	function handleChangeContentType(e, value) {
		if (value && value !== contentType) {
			setData({ episodes: [] });
			setContentType(value);
		}
	}

	useEffect(() => {
		setData({
			episodes: [],
			page: 0,
			hasMore: true,
			triedToFetch: false,
		});
	}, [filter, contentType]);

	return (
		<div align="center">
			<ToggleButtonGroup
				value={contentType}
				onChange={handleChangeContentType}
				color="primary"
				exclusive
				style={{ marginRight: "20px" }}
			>
				<ToggleButton value="tv" className={classes.episodeBtn} color="primary" variant="outlined">
					{translate("tv")}
				</ToggleButton>
				<ToggleButton value="movie" className={classes.episodeBtn} color="primary" variant="outlined">
					{translate("movies")}
				</ToggleButton>
			</ToggleButtonGroup>
			{contentType === "movie" ? (
				<ToggleButtonGroup value={filter} onChange={handleFilterEpisodes} color="primary" exclusive>
					<ToggleButton value="passed" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("releasedEpisodes")}
					</ToggleButton>
					<ToggleButton value="future" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("upcomingEpisodes")}
					</ToggleButton>
				</ToggleButtonGroup>
			) : (
				<ToggleButtonGroup value={filter} onChange={handleFilterEpisodes} color="primary" exclusive>
					<ToggleButton value="passed" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("releasedEpisodes")}
					</ToggleButton>
					<ToggleButton value="future" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("upcomingEpisodes")}
					</ToggleButton>
					<ToggleButton value="finale" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("finaleEpisodes")}
					</ToggleButton>
					<ToggleButton value="watched" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("watchedEpisodes")}
					</ToggleButton>
					<ToggleButton value="toWatch" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("toWatchEpisodes")}
					</ToggleButton>
					<ToggleButton value="queue" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("inQueueEpisodes")}
					</ToggleButton>
				</ToggleButtonGroup>
			)}
			<InfiniteScroll loadMore={handleGetAll} hasMore={data.hasMore} loader={<Loading key={0} />}>
				{contentType === "movie" ? (
					<Grid container spacing={2}>
						{data.triedToFetch && data.episodes.length === 0 ? (
							<Grid item xs={12} key={1}>
								<div className={classes.noEpisodes}>{translate("noEpisodes")}</div>
							</Grid>
						) : (
							<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
								{data.episodes.map(series => (
									<div key={series.externalId} style={{ padding: "8px" }}>
										<Banner series={series} contentType="movie" bannerWidth={180} actions />
									</div>
								))}
							</div>
						)}
					</Grid>
				) : (
					<Grid container spacing={2}>
						{data.triedToFetch && data.episodes.length === 0 ? (
							<Grid item xs={12} key={1}>
								<div className={classes.noEpisodes}>{translate("noEpisodes")}</div>
							</Grid>
						) : (
							data.episodes.map(episode => (
								<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={episode._id}>
									<Episode episode={episode} clickableSeries />
								</Grid>
							))
						)}
					</Grid>
				)}
			</InfiniteScroll>
		</div>
	);
}

export default Feed;
