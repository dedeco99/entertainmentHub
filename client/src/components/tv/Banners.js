import React, { useContext } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

import {
	makeStyles,
	Typography,
	Box,
	Grid,
	LinearProgress,
	Card,
	CardActionArea,
	Checkbox,
	Tooltip,
} from "@material-ui/core";

import Loading from "../.partials/Loading";

import { TVContext } from "../../contexts/TVContext";

import { addSubscriptions, deleteSubscription } from "../../api/subscriptions";

import { banners as styles } from "../../styles/TV";

import placeholder from "../../img/noimage.png";
import { translate } from "../../utils/translations";

const useStyles = makeStyles(styles);

function Banners({ series, getMore, hasMore, hasActions, bannerWidth, useWindowScroll }) {
	const classes = useStyles();
	const { state, dispatch } = useContext(TVContext);
	const { subscriptions } = state;

	async function handleAddSeries(serie) {
		const seriesToAdd = series.find(s => s.externalId === serie.externalId);
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

	function renderSeriesBlock() {
		if (!series || !series.length) return <div />;

		return (
			<Grid container justify="center">
				{series.map(serie => (
					<Grid item key={serie.externalId} style={{ padding: "8px" }}>
						<Box display="flex" flexDirection="column" width={bannerWidth} height="100%">
							<Card component={Box} mb={1}>
								<CardActionArea
									onClick={() => {
										// TODO: Change this onclick to our own series page
										const newWindow = window.open(
											`https://www.imdb.com/title/${serie.imdbId}`,
											"_blank",
											"noopener,noreferrer",
										);
										if (newWindow) newWindow.opener = null;
									}}
								>
									<Box>
										<img
											style={{ display: "block", width: "100%" }}
											src={serie.image ? serie.image : placeholder}
											alt="Serie poster"
											draggable="false"
										/>
										<LinearProgress
											variant="determinate"
											value={1} // TODO: Watched %
											className={classes.watchedProgressBar}
											style={{ display: "none" }}
										/>
									</Box>
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
											title={
												subscriptions.map(us => us.externalId).includes(serie.externalId.toString())
													? translate("removeFavorites")
													: translate("addFavorites")
											}
											placement="top"
										>
											<Checkbox
												color="secondary"
												checked={subscriptions.map(us => us.externalId).includes(serie.externalId.toString())}
												icon={<i className="icon-heart" style={{ fontSize: "0.875rem" }} />}
												checkedIcon={<i className="icon-heart" style={{ fontSize: "0.875rem" }} />}
												onChange={e => handleFavoriteChange(e, serie)}
												classes={{ root: classes.checkboxSize }}
											/>
										</Tooltip>
										<Tooltip
											title={
												subscriptions.map(us => us.externalId).includes(serie.externalId.toString())
													? translate("removeWatched")
													: translate("addWatched")
											}
											placement="top"
										>
											<Checkbox
												// TODO: Mark as watched
												color="primary"
												//checked={subscriptions.map(us => us.externalId).includes(serie.externalId.toString())}
												icon={<i className="icon-eye" style={{ fontSize: "0.875rem" }} />}
												checkedIcon={<i className="icon-eye" style={{ fontSize: "0.875rem" }} />}
												//onChange={e => handleFavoriteChange(e, serie)}
												classes={{ root: classes.checkboxSize }}
											/>
										</Tooltip>
									</>
								)}
								{serie.rating ? (
									<Box display="flex" alignItems="center" color="#fbc005" height="100%">
										<i className="icon-star" style={{ paddingLeft: "5px", paddingRight: "5px" }} />
										<Typography variant="caption">{serie.rating}</Typography>
									</Box>
								) : null}
							</Box>
						</Box>
					</Grid>
				))}
			</Grid>
		);
	}

	return (
		<InfiniteScroll
			pageStart={0}
			loadMore={getMore}
			hasMore={hasMore}
			loader={<Loading key={0} />}
			useWindow={useWindowScroll}
		>
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
