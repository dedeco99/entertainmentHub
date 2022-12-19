import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

import { makeStyles, Grid } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import Loading from "../.partials/Loading";
import Episode from "./Episode";

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

	async function handleGetAll() {
		const response = await getEpisodes("all", null, data.page, filter);

		if (response.status === 200) {
			setData(prev => ({
				episodes: prev.episodes.concat(response.data),
				page: prev.page + 1,
				hasMore: !(response.data.length < 50),
				triedToFetch: true,
			}));
		}
	}

	function handleFilterEpisodes(e, value) {
		if (value && value !== filter) setFilter(value);
	}

	useEffect(() => {
		setData({
			episodes: [],
			page: 0,
			hasMore: true,
			triedToFetch: false,
		});
	}, [filter]);

	return (
		<div align="center">
			<ToggleButtonGroup value={filter} onChange={handleFilterEpisodes} color="primary" exclusive>
				<ToggleButton value="passed" className={classes.episodeBtn} color="primary" variant="outlined">
					{translate("releasedEpisodes")}
				</ToggleButton>
				<ToggleButton value="future" className={classes.episodeBtn} color="primary" variant="outlined">
					{translate("upcomingEpisodes")}
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
			<InfiniteScroll loadMore={handleGetAll} hasMore={data.hasMore} loader={<Loading key={0} />}>
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
			</InfiniteScroll>
		</div>
	);
}

export default Feed;
