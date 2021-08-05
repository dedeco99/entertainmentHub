import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

import {
	makeStyles,
	Typography,
	Box,
	Grid,
	LinearProgress,
	Card,
	CardMedia,
	CardActionArea,
	Checkbox,
	Tooltip,
	Chip,
	IconButton,
	Zoom,
	Slide,
} from "@material-ui/core";

import Loading from "../.partials/Loading";

import { TVContext } from "../../contexts/TVContext";

import {
	getSubscriptions,
	addSubscriptions,
	patchSubscription,
	deleteSubscription,
} from "../../api/subscriptions";
import { getProviders } from "../../api/tv";

import { banners as styles } from "../../styles/TV";

import placeholder from "../../img/noimage.png";
import { translate } from "../../utils/translations";

const useStyles = makeStyles(styles);

function Banners({ series, getMore, hasMore, hasActions, bannerWidth, useWindowScroll }) {
	const classes = useStyles();
	const { state, dispatch } = useContext(TVContext);
	const { subscriptions } = state;
	const [providers, setProviders] = useState({});
	const [rerender, setRerender] = useState(true);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			const response = await getSubscriptions("tv");

			if (response.status === 200 && isMounted) {
				dispatch({ type: "SET_SUBSCRIPTIONS", subscriptions: response.data });
			}
		}

		if (!subscriptions.length) fetchData();

		return () => (isMounted = false);
	}, []);

	async function handleAddSeries(serie) {
		const seriesToAdd = series.find(s => s.externalId === serie.externalId);
		seriesToAdd.externalId = seriesToAdd.externalId.toString();
		seriesToAdd.group = { name: "Ungrouped" };
		const response = await addSubscriptions("tv", [seriesToAdd]);

		if (response.status === 201) {
			dispatch({ type: "ADD_SUBSCRIPTION", subscription: response.data });
		}
	}

	async function handleDeleteSeries(serie) {
		const seriesToRemove = subscriptions.find(s => s.externalId === serie.externalId.toString());
		const response = await deleteSubscription(seriesToRemove._id);

		if (response.status === 200) {
			dispatch({ type: "DELETE_SUBSCRIPTION", subscription: response.data });
		}
	}

	/*
		function getTrendIcon(trend) {
			if (Number(trend) > 0) return "icon-caret-up";
			else if (Number(trend) < 0) return "icon-caret-down";
			else return "icon-sunrise";
		}

		<Box position="absolute" top="0" left="0" width="100%" p={1}>
			<Chip color="primary" size="small" label={`${serie.rank}º`} />
			<Chip
				color="primary"
				size="small"
				icon={<i className={getTrendIcon(serie.trend)} />}
				label={Number.isInteger(serie.trend) ? serie.trend : serie.trend.substring(1)}
				className={classes.trendingChip}
				classes={{ labelSmall: classes.trendingChipLabel }}
			/>
		</Box>
	*/

	function handleFavoriteChange(e, serie) {
		if (e.target.checked) handleAddSeries(serie);
		else handleDeleteSeries(serie);
	}

	function isSubscribed(serie) {
		return subscriptions.map(us => us.externalId).includes(serie.externalId.toString());
	}

	async function handleMarkAsWatched(e, serie) {
		const isWatched = serie.numWatched > 0 && serie.numTotal === serie.numWatched;
		const response = await patchSubscription(serie.externalId, !isWatched, "all");

		if (response.status === 200) {
			// This looks like the inverse logic but because we are using the old isWatched it works
			serie.numWatched = isWatched ? 0 : serie.numTotal;
			serie.numToWatch = isWatched ? serie.numTotal : 0;

			dispatch({ type: "EDIT_SUBSCRIPTION", subscription: { ...response.data, numToWatch: serie.numToWatch } });

			setRerender(!rerender);
		}
	}

	async function handleGetProviders(serie) {
		const response = await getProviders(serie.displayName);

		if (response.status === 200) {
			setProviders({ ...providers, [serie.externalId]: response.data });
		}
	}

	function renderSeriesBlock() {
		if (!series || !series.length) return <div />;

		return (
			<Grid container justify="center">
				{/* eslint-disable-next-line complexity*/}
				{series.map(serie => (
					<Grid item key={serie.externalId} style={{ padding: "8px" }}>
						<Box display="flex" flexDirection="column" width={bannerWidth} height="100%">
							<Card component={Box} mb={1}>
								<CardActionArea>
									<a
										href={
											serie.imdbId
												? `https://www.imdb.com/title/${serie.imdbId}`
												: `https://www.themoviedb.org/tv/${serie.externalId}` // TODO: Change this onclick to our own series page
										}
										target="_blank"
										rel="noreferrer"
									>
										<CardMedia
											component="img"
											width="100%"
											image={serie.image ? serie.image : placeholder}
											style={{ display: "block", width: "100%" }}
										/>
									</a>
									<Zoom in={providers[serie.externalId]}>
										<Box
											style={{
												position: "absolute",
												bottom: "2px",
												right: "1px",
											}}
										>
											{providers[serie.externalId] && providers[serie.externalId].length ? (
												providers[serie.externalId].map(provider => (
													<a href={provider.url} target="_blank" rel="noreferrer" key={provider.url}>
														<img
															src={provider.icon}
															height="35px"
															style={{ margin: "2px", borderRadius: "2px" }}
														/>
													</a>
												))
											) : (
												<i className="icon-close-circled icon-3x" />
											)}
										</Box>
									</Zoom>
									<Zoom in={serie.numToWatch > 0}>
										<Chip
											color="secondary"
											size="small"
											label={serie.numToWatch}
											style={{ position: "absolute", top: "5px", right: "5px", borderRadius: "2px" }}
										/>
									</Zoom>
									<Slide direction="right" timeout={750} in={serie.numWatched > 0}>
										<Tooltip title={`${serie.numWatched} watched`} placement="top">
											<LinearProgress
												color="secondary"
												variant="determinate"
												value={(serie.numWatched / serie.numTotal) * 100}
												className={classes.watchedProgressBar}
											/>
										</Tooltip>
									</Slide>
								</CardActionArea>
							</Card>
							<Typography variant="body2" style={{ display: "flex", flexGrow: 1 }}>
								{serie.displayName}
							</Typography>
							<Box display="flex" alignItems="center">
								<Typography
									variant="caption"
									style={{
										display: "flex",
										flexGrow: 1,
										color: "#aeaeae",
									}}
								>
									{serie.year || null}
								</Typography>
								{hasActions && (
									<>
										<Tooltip
											title={isSubscribed(serie) ? translate("removeFavorites") : translate("addFavorites")}
											placement="top"
										>
											<Checkbox
												color="secondary"
												checked={isSubscribed(serie)}
												icon={<i className="icon-heart" style={{ fontSize: "0.875rem" }} />}
												checkedIcon={<i className="icon-heart" style={{ fontSize: "0.875rem" }} />}
												onChange={e => handleFavoriteChange(e, serie)}
												classes={{ root: classes.checkboxSize }}
											/>
										</Tooltip>
										<Tooltip
											title={
												isSubscribed(serie) && serie.numWatched > 0 && serie.numTotal === serie.numWatched
													? translate("removeWatched")
													: translate("addWatched")
											}
											placement="top"
										>
											<Checkbox
												color="secondary"
												checked={
													isSubscribed(serie) && serie.numWatched > 0 && serie.numTotal === serie.numWatched
												}
												disabled={!isSubscribed(serie)}
												icon={<i className="icon-eye" style={{ fontSize: "0.875rem" }} />}
												checkedIcon={<i className="icon-eye" style={{ fontSize: "0.875rem" }} />}
												onChange={e => handleMarkAsWatched(e, serie)}
												classes={{ root: classes.checkboxSize }}
											/>
										</Tooltip>
									</>
								)}
								{serie.rating ? (
									<Box
										display="flex"
										alignItems="center"
										color="#fbc005"
										height="100%"
										style={{ paddingRight: "5px" }}
									>
										<i className="icon-star" style={{ paddingLeft: "5px", paddingRight: "5px" }} />
										<Typography variant="caption">{serie.rating}</Typography>
									</Box>
								) : null}
								<Tooltip title={"Providers"} placement="top">
									<IconButton onClick={() => handleGetProviders(serie)} classes={{ root: classes.checkboxSize }}>
										<i className="icon-monitor" style={{ fontSize: "0.875rem" }} />
									</IconButton>
								</Tooltip>
							</Box>
						</Box>
					</Grid>
				))}
			</Grid>
		);
	}

	return (
		<InfiniteScroll loadMore={getMore} hasMore={hasMore} loader={<Loading key={0} />} useWindow={useWindowScroll}>
			{renderSeriesBlock()}
		</InfiniteScroll>
	);
}

Banners.propTypes = {
	series: PropTypes.array.isRequired,
	getMore: PropTypes.func.isRequired,
	hasMore: PropTypes.bool.isRequired,
	hasActions: PropTypes.bool.isRequired,
	bannerWidth: PropTypes.number.isRequired,
	useWindowScroll: PropTypes.bool.isRequired,
};

export default Banners;
