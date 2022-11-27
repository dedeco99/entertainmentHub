import React, { useContext, useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useHistory, useRouteMatch } from "react-router-dom";
import dayjs from "dayjs";

import { makeStyles, withStyles, Grid, Box, Typography, Tabs, Tab, Checkbox } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import Loading from "../.partials/Loading";
import Episode from "./Episode";

import { TVContext } from "../../contexts/TVContext";

import { getAsset } from "../../api/assets";
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
	const [episodes, setEpisodes] = useState([]);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(false);
	const [filter, setFilter] = useState("passed");
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(true);
	const [currentSeries, setCurrentSeries] = useState(null);
	const [assets, setAssets] = useState(null);
	let isMounted = true;
	const hasUnwatchedEpisodes = !!episodes.filter(e => e.date && diff(e.date) > 0).find(e => !e.watched);

	async function handleGetAll() {
		if (!loading) {
			setLoading(true);

			if (page === 0) setOpen(false);

			const response = await getEpisodes("all", null, page, filter);

			if (response.status === 200 && isMounted) {
				const newEpisodes = page === 0 ? response.data : episodes.concat(response.data, episodes);

				setEpisodes(newEpisodes);
				setPage(page + 1);
				setHasMore(!(response.data.length < 50));

				if (page === 0) setOpen(true);
			}

			setLoading(false);
		}
	}

	function handleSeasonClick(season) {
		if (Number(match.params.season) !== season) history.push(`/tv/${match.params.seriesId}/${season}`);
	}

	async function handleGetInfo(seriesId, season) {
		setOpen(false);

		if (seriesId !== currentSeries) {
			setCurrentSeries(seriesId);

			const res = await getAsset("tv", seriesId);

			if (res.status === 200) {
				const firstDate = dayjs(res.data.firstDate);
				const lastDate = dayjs(res.data.lastDate);

				setAssets({
					...res.data,
					date:
						firstDate.diff(lastDate, "years") === 0 || isNaN(firstDate.diff(lastDate, "years"))
							? firstDate.get("year")
							: `${firstDate.get("year")} - ${lastDate.get("year")}`,
					genres: res.data.genres.map(genre => genre.name).join(", "),
					backdrops: res.data.backdrops[Math.floor(Math.random() * res.data.backdrops.length)],
				});
			} else {
				setAssets(null);
			}
		}

		const response = await getEpisodes(seriesId, season);

		if (response.status === 200 && isMounted) {
			setEpisodes(response.data);
		}

		setOpen(true);
	}

	function handleFilterEpisodes(e, value) {
		if (value && value !== filter) {
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
					history.replace(`/tv/${match.params.seriesId}/1`);
					break;
				case "/tv/:seriesId/:season":
					await handleGetInfo(match.params.seriesId, match.params.season);
					break;
				default:
					break;
			}
		}

		fetchData();

		return () => (isMounted = false);
	}, [match.url]);

	async function markAsWatched() {
		const response = await patchSubscription(episodes[0].series._id, {
			markAsWatched: hasUnwatchedEpisodes,
			watched: episodes.filter(e => e.date && diff(e.date) > 0).map(e => `S${e.season}E${e.number}`),
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
				{open ? (
					<InfiniteScroll loadMore={handleGetAll} hasMore={hasMore} loader={<Loading key={0} />}>
						<Grid container spacing={2}>
							{renderEpisodes()}
						</Grid>
					</InfiniteScroll>
				) : (
					<Loading />
				)}
			</div>
		);
	}

	function renderSeasons() {
		return (
			<>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={12} md>
						{assets && assets.displayName ? (
							<Box
								position="relative"
								width="100%"
								height="100%"
								minHeight="450px"
								borderRadius="5px"
								style={{
									backgroundImage: `url("${assets.backdrops}")`,
									backgroundSize: "cover",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
								}}
							>
								<Box
									position="absolute"
									bottom="0px"
									left="0px"
									width="100%"
									padding={3}
									borderRadius="4px"
									style={{ background: "linear-gradient(0deg, black 0%, transparent 100%)" }}
								>
									<Box display="flex">
										<Box flexGrow="1">
											<Typography variant="h2" style={{ fontWeight: "bold" }}>
												{assets.displayName}
											</Typography>
											<Typography variant="body1">{`${assets.date} (${assets.status})`}</Typography>
											<Box display="flex">
												<Typography variant="body1">
													{`${assets.genres} • ${assets.episodeRunTime ? `${assets.episodeRunTime}m` : ""}`}
												</Typography>
												<Box display="flex" alignItems="center" color="#fbc005">
													{assets.rating && (
														<>
															<i className="icon-star" style={{ paddingLeft: "5px", paddingRight: "5px" }} />
															<Typography variant="body1">{assets.rating}</Typography>
														</>
													)}
												</Box>
											</Box>
											<Typography variant="body1">{assets.overview}</Typography>
										</Box>
										<Box
											display="flex"
											justifyContent="flex-end"
											alignContent="flex-end"
											flexShrink="0"
											flexWrap="wrap"
											maxWidth="174px"
										>
											{assets.providers.map(provider => (
												<a
													href={provider.url}
													target="_blank"
													rel="noopener noreferrer"
													key={provider._id}
													style={{ paddingLeft: "8px" }}
												>
													<img src={provider.icon} width="50px" height="50px" />
												</a>
											))}
										</Box>
									</Box>
								</Box>
							</Box>
						) : (
							<Box
								display="flex"
								height="100%"
								alignItems="center"
								justifyContent="center"
								borderRadius="5px"
								minHeight="450px"
								style={{ backgroundColor: "#212121" }}
							>
								<Typography variant="h2" align="center">
									{"No info about this serie"}
								</Typography>
							</Box>
						)}
					</Grid>
					<Grid item xs={12} sm={12} md="auto">
						<Box
							display="flex"
							flexDirection="column"
							p={2}
							pb={0}
							style={{ backgroundColor: "#222" }}
							borderRadius={5}
						>
							<Typography variant="body1" style={{ paddingBottom: "8px" }}>
								{"Latest episodes"}
							</Typography>
							{assets &&
								assets.latestEpisodes.map(episode => (
									<Box key={episode._id} mb={2}>
										<Episode episode={episode} />
									</Box>
								))}
						</Box>
					</Grid>
				</Grid>
				<Box display="flex" flexDirection="row" alignItems="center" py={2}>
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
							{assets &&
								assets.seasons.map(season => (
									<ChipTab
										key={season}
										value={season}
										color="primary"
										label={`Season ${season}`}
										onClick={() => handleSeasonClick(season)}
									/>
								))}
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
				{open ? (
					<Grid container spacing={2}>
						{renderEpisodes()}
					</Grid>
				) : (
					<Loading />
				)}
			</>
		);
	}

	if (match.path === "/tv/all") return renderAllEpisodes();

	return renderSeasons();
}

export default Episodes;
