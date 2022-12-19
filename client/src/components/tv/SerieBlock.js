import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import dayjs from "dayjs";

import { makeStyles, withStyles, Grid, Box, Typography, Tabs, Tab, Checkbox } from "@material-ui/core";

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
		maxWidth: "850px",
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

function SerieBlock({ seriesId, season }) {
	const classes = useStyles();
	const history = useHistory();
	const { dispatch } = useContext(TVContext);
	const [episodes, setEpisodes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentSeries, setCurrentSeries] = useState(null);
	const [assets, setAssets] = useState(null);
	let isMounted = true;
	const hasUnwatchedEpisodes = !!episodes.filter(e => e.date && diff(e.date) > 0).find(e => !e.watched);

	function handleSeasonClick(newSeason) {
		if (Number(season) !== newSeason) history.push(`/tv/series/${seriesId}/${newSeason}`);
	}

	async function handleGetInfo() {
		setLoading(false);

		if (seriesId && seriesId !== currentSeries) {
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

		setLoading(true);
	}

	useEffect(() => {
		async function fetchData() {
			await handleGetInfo();
		}

		fetchData();

		return () => (isMounted = false);
	}, [seriesId, season]);

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

	return (
		<>
			<div>
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
							height="100%"
							padding={3}
							borderRadius="4px"
							style={{ background: "linear-gradient(0deg, black 0%, transparent 50%, black 100%)" }}
						>
							<Grid container alignItems="stretch" style={{ height: "100%" }}>
								<Grid item xs={12} md={6}>
									<Box display="flex" flexDirection="column" px={5} py={3} height="100%">
										<Typography variant="h2" style={{ fontWeight: "bold" }}>
											{assets.displayName}
										</Typography>
										<Typography variant="body1" style={{ flex: "1 0 0", overflow: "hidden" }}>
											{assets.overview}
										</Typography>
										<div style={{ display: "flex", paddingTop: "10px" }}>
											<div style={{ flex: "1 0 0", padding: "4px" }}>
												<Typography variant="body1">{"Rating"}</Typography>
												<Box display="flex" alignItems="center" color="#fbc005">
													{assets.rating && (
														<>
															<i className="icon-star" style={{ paddingLeft: "5px", paddingRight: "5px" }} />
															<Typography variant="body1">{assets.rating}</Typography>
														</>
													)}
												</Box>
											</div>
											<div style={{ flex: "2 0 0", padding: "4px" }}>
												<Typography variant="body1">{"Genres"}</Typography>
												<Typography variant="body1">
													{`${assets.genres}`}
													{/* ${assets.episodeRunTime ? `${assets.episodeRunTime}m` : ""} */}
												</Typography>
											</div>
											<div style={{ flex: "1 0 0", padding: "4px" }}>
												<Typography variant="body1">{"Status"}</Typography>
												{/* <Typography variant="body1">{assets.date}</Typography> */}
												<Typography variant="body1">{assets.status}</Typography>
											</div>
										</div>
									</Box>
								</Grid>
								<Box component={Grid} item md={6} display={{ sm: "none", md: "block" }}>
									<Box display="flex" flexDirection="column" height="100%">
										<Box display="flex" flexGrow="1" justifyContent="flex-end">
											{assets.providers.map(provider => (
												<a
													href={provider.url}
													target="_blank"
													rel="noopener noreferrer"
													key={provider._id}
													style={{ width: "50px", height: "50px" }}
												>
													<img src={provider.icon} width="50px" height="50px" />
												</a>
											))}
										</Box>
										<Typography variant="body1" style={{ padding: "0 0 8px 16px" }}>
											{"Watch next"}
										</Typography>
										<Box display="flex">
											{assets &&
												assets.latestEpisodes.map(episode => (
													<div key={episode._id} style={{ paddingLeft: "16px" }}>
														<Episode episode={episode} />
													</div>
												))}
										</Box>
									</Box>
								</Box>
							</Grid>
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
							{"No info about this series"}
						</Typography>
					</Box>
				)}
			</div>
			<div style={{ padding: "0px 80px" }}>
				<Box display="flex" flexDirection="row" alignItems="center" py={2}>
					<Typography variant="h2" style={{ flex: "1 0 0" }}>
						{"Seasons"}
					</Typography>
					<div style={{ overflowX: "hidden" }}>
						<ChipTabs
							value={Number(season)}
							variant="scrollable"
							scrollButtons="auto"
							TabIndicatorProps={{
								style: {
									display: "none",
								},
							}}
						>
							{assets &&
								assets.seasons.map(serieSeason => (
									<ChipTab
										key={serieSeason}
										value={serieSeason}
										color="primary"
										label={`Season ${serieSeason}`}
										onClick={() => handleSeasonClick(serieSeason)}
									/>
								))}
						</ChipTabs>
					</div>
					<Checkbox
						color="secondary"
						checked={!hasUnwatchedEpisodes}
						icon={<i className="icon-eye" />}
						checkedIcon={<i className="icon-eye" />}
						onChange={markAsWatched}
						style={{ marginRight: "10px" }}
					/>
				</Box>
				{loading ? (
					<Grid container spacing={2}>
						{episodes && episodes.length ? (
							episodes.map(episode => (
								<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={episode._id}>
									<Episode episode={episode} />
								</Grid>
							))
						) : (
							<Grid item xs={12} key={1}>
								<div className={classes.noEpisodes}>{translate("noEpisodes")}</div>
							</Grid>
						)}
					</Grid>
				) : (
					<Loading />
				)}
			</div>
		</>
	);
}

SerieBlock.propTypes = {
	seriesId: PropTypes.string,
	season: PropTypes.string,
};

export default SerieBlock;
