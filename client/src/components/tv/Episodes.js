import React, { useContext, useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles, withStyles, Grid, Box, Typography, Tabs, Tab, Checkbox } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import Loading from "../.partials/Loading";
import Episode from "./Episode";

import { TVContext } from "../../contexts/TVContext";

import { getEpisodes } from "../../api/tv";
import { patchSubscription } from "../../api/subscriptions";

import { diff } from "../../utils/utils";
import { translate } from "../../utils/translations";

import { episodes as styles } from "../../styles/TV";

const useStyles = makeStyles(styles);

const ChipTabs = withStyles({
	root: {
		alignItems: "center",
		minHeight: "0px",
	},
})(Tabs);

const ChipTab = withStyles(() => ({
	root: {
		textTransform: "none",
		backgroundColor: "transparent",
		borderRadius: "16px",
		border: "1px solid white",
		color: "white",
		minWidth: 0,
		minHeight: 0,
		height: "32px",
		whiteSpace: "nowrap",
		marginRight: "10px",
		fontFamily: "Roboto",
	},
	selected: { backgroundColor: "#ec6e4c", color: "white", borderColor: "#ec6e4c" },
}))(props => <Tab {...props} />);

function Episodes() {
	const history = useHistory();
	const match = useRouteMatch();
	const classes = useStyles();
	const { dispatch } = useContext(TVContext);
	const [seasons, setSeasons] = useState([]);
	const [episodes, setEpisodes] = useState([]);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(false);
	const [filter, setFilter] = useState("passed");
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [currentSeries, setCurrentSeries] = useState(null);
	let isMounted = true;
	const hasUnwatchedEpisodes = !!episodes.find(e => !e.watched);

	async function handleGetAll() {
		if (!loading) {
			setLoading(true);

			if (page === 0) setOpen(false);

			const response = await getEpisodes("all", page, filter);

			if (response.status === 200 && isMounted) {
				const newEpisodes = page === 0 ? response.data : episodes.concat(response.data);

				setEpisodes(newEpisodes);
				setPage(page + 1);
				setHasMore(!(response.data.length < 50));

				if (page === 0) setOpen(true);
			}

			setLoading(false);
		}
	}

	function updateUrlFilter(seriesId, season) {
		history.push(`/tv/${seriesId}/${season}`);
	}

	function handleSeasonClick(season) {
		if (Number(match.params.season) !== season) updateUrlFilter(match.params.seriesId, season);
	}

	function handleGetEpisodes(season) {
		const foundSeason = seasons.find(s => s._id === Number(season));

		if (foundSeason) setEpisodes(foundSeason.episodes);
	}

	async function handleGetSeasons(seriesId) {
		setOpen(false);

		const response = await getEpisodes(seriesId);

		if (response.status === 200 && isMounted) {
			response.data = response.data.map(season => ({
				...season,
				toWatch: season.episodes.filter(episode => !episode.watched).length,
			}));

			setCurrentSeries(seriesId);
			setSeasons(response.data);
			setPage(0);

			setOpen(true);
		}
	}

	async function handleGetInfo(seriesId, season) {
		if (season && seasons.length && currentSeries === seriesId) {
			handleGetEpisodes(season);
		} else {
			await handleGetSeasons(seriesId);
		}
	}

	function handleFilterEpisodes(e, value) {
		if (value && value !== filter) {
			setSeasons([]);
			setEpisodes([]);
			setPage(0);
			setFilter(value);
		}
	}

	useEffect(() => {
		async function fetchData() {
			switch (match.path) {
				case "/tv/all":
					await handleGetAll();
					break;
				case "/tv/:seriesId":
					await handleGetInfo(match.params.seriesId);
					break;
				case "/tv/:seriesId/:season":
					await handleGetInfo(match.params.seriesId, Number(match.params.season));
					break;
				default:
					break;
			}
		}

		fetchData();
	}, [match.url]);

	useEffect(() => {
		async function fetchData() {
			if (seasons.length) {
				if (match.params.season) {
					handleGetEpisodes(Number(match.params.season));
				} else {
					history.replace(`/tv/${match.params.seriesId}/${seasons[0]._id}`);
				}
			} else {
				await handleGetAll();
			}
		}

		fetchData();

		return () => (isMounted = false);
	}, [seasons, filter]);

	async function markAsWatched() {
		const response = await patchSubscription(episodes[0].series._id, {
			markAsWatched: hasUnwatchedEpisodes,
			watched: episodes.map(e => `S${e.season}E${e.number}`),
		});

		if (response.status === 200) {
			let increment = 0;
			for (const episode of episodes) {
				const newWatched = Boolean(
					response.data.watched.find(w => w.key === `S${episode.season}E${episode.number}`),
				);

				if (newWatched && !episode.watched) {
					increment--;
				} else if (!newWatched && episode.watched) {
					increment++;
				}

				episode.watched = newWatched;
			}

			dispatch({ type: "EDIT_EPISODES_TO_WATCH", subscription: response.data, increment });
		}
	}

	function renderEpisodes() {
		if (episodes && episodes.length) {
			return episodes.map(episode => (
				<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={episode._id}>
					<Episode episode={episode} />
				</Grid>
			));
		}

		return (
			<Grid item xs={12} key={1}>
				<div className={classes.noEpisodes}>{translate("noEpisodes")}</div>
			</Grid>
		);
	}

	function renderAllEpisodes() {
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
				<InfiniteScroll loadMore={handleGetAll} hasMore={hasMore} loader={<Loading key={0} />}>
					<Grid container spacing={2}>
						{renderEpisodes()}
					</Grid>
				</InfiniteScroll>
			</div>
		);
	}

	function renderSeasons() {
		let latestEpisodes = [];
		let nextEpisodeToWatch = null;
		for (let i = seasons.length - 1; i >= 0; i--) {
			const releasedEpisodes = seasons[i].episodes.filter(e => diff(e.date) > 0);
			if (latestEpisodes.length < 3) latestEpisodes = latestEpisodes.concat(releasedEpisodes.slice(0, 3));

			const episodesToWatch = releasedEpisodes.filter(e => !e.watched);

			if (episodesToWatch.length) nextEpisodeToWatch = episodesToWatch[episodesToWatch.length - 1];

			if (!nextEpisodeToWatch && i === 0) {
				nextEpisodeToWatch = seasons[seasons.length - 1].episodes.filter(e => diff(e.date) > 0)[0];

				if (!nextEpisodeToWatch) nextEpisodeToWatch = latestEpisodes[0];
			}
		}

		return (
			<Box>
				{nextEpisodeToWatch && (
					<Box display="flex" flexDirection="row">
						<Box flexGrow="1">
							<Episode episode={nextEpisodeToWatch} height={"555px"} />
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							p={2}
							ml={2}
							pb={0}
							style={{ backgroundColor: "#222" }}
							borderRadius={5}
						>
							<Typography variant="body1" style={{ paddingBottom: "8px" }}>
								{"Latest episodes"}
							</Typography>
							{latestEpisodes.map(episode => (
								<Box key={episode._id} width="250px" height="150px" mb={2}>
									<Episode episode={episode} />
								</Box>
							))}
						</Box>
					</Box>
				)}
				<Box display="flex" flexDirection="row" alignItems="center" py={3}>
					<Box flex="1 0 0" px={1} style={{ overflowX: "hidden" }}>
						<ChipTabs
							value={Number(match.params.season)}
							variant="scrollable"
							scrollButtons="auto"
							TabIndicatorProps={{
								style: {
									display: "none",
								},
							}}
						>
							{seasons.map(season => {
								return (
									<ChipTab
										key={season._id}
										value={season._id}
										color="primary"
										label={`Season ${season._id}`}
										onClick={() => handleSeasonClick(season._id)}
									/>
								);
							})}
						</ChipTabs>
					</Box>
					<Checkbox
						color="secondary"
						checked={!hasUnwatchedEpisodes}
						disabled={loading}
						icon={<i className="icon-eye" />}
						checkedIcon={<i className="icon-eye" />}
						onChange={markAsWatched}
						style={{ marginRight: "10px" }}
					/>
				</Box>
				<Grid container spacing={2} className={classes.episodeListContainer}>
					{renderEpisodes()}
				</Grid>
			</Box>
		);
	}

	if (!open) return <Loading />;

	if (match.path === "/tv/all") return renderAllEpisodes();

	return renderSeasons();
}

export default Episodes;
