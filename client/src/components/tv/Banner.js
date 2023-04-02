import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import dayjs from "dayjs";

import {
	makeStyles,
	Typography,
	Box,
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
	Menu,
	MenuItem,
} from "@material-ui/core";
import Placeholder from "../.partials/Placeholder";

import { TVContext } from "../../contexts/TVContext";
import { SubscriptionContext } from "../../contexts/SubscriptionContext";

import { addSubscriptions, patchSubscription, deleteSubscription } from "../../api/subscriptions";
import { getProviders } from "../../api/tv";

import { banners as styles } from "../../styles/TV";
import { formatDate } from "../../utils/utils";
import { translate } from "../../utils/translations";

const useStyles = makeStyles(styles);

// eslint-disable-next-line complexity
function Banner({ series, contentType, bannerWidth, actions }) {
	const classes = useStyles();
	const { dispatch: subscriptionDispatch } = useContext(SubscriptionContext);
	const { state, dispatch } = useContext(TVContext);
	const { series: seriesInfo } = state;
	const [originalSeriesVisible, setOriginalSeriesVisible] = useState(false);
	const [, setSelectedSubscription] = useState(null);
	const [isSubscribed, setIsSubscribed] = useState(!!series._id);
	const [providers, setProviders] = useState(
		series.providers && series.providers.length ? series.providers : null,
	);
	const [anchorEl, setAnchorEl] = useState(null);

	function handleSetAnchorEl(e) {
		e.stopPropagation();
		setAnchorEl(e.currentTarget);
	}

	function handleClose() {
		setAnchorEl(null);
	}

	function handleShowModal(subscription) {
		setSelectedSubscription(subscription);

		subscriptionDispatch({ type: "SET_SUBSCRIPTION", subscription });
		subscriptionDispatch({ type: "SET_IS_NOTIFICATION", isNotification: false });
		subscriptionDispatch({ type: "SET_OPEN", open: true });
	}

	const menuOptions = [{ displayName: translate("edit"), onClick: subscription => handleShowModal(subscription) }];

	/*
		function getTrendIcon(trend) {
			if (Number(trend) > 0) return "icon-caret-up";
			else if (Number(trend) < 0) return "icon-caret-down";
			else return "icon-sunrise";
		}

		<Box position="absolute" top="0" left="0" width="100%" p={1}>
			<Chip color="primary" size="small" label={`${series.rank}º`} />
			<Chip
				color="primary"
				size="small"
				icon={<i className={getTrendIcon(series.trend)} />}
				label={Number.isInteger(series.trend) ? series.trend : series.trend.substring(1)}
				className={classes.trendingChip}
				classes={{ labelSmall: classes.trendingChipLabel }}
			/>
		</Box>
	*/

	async function handleSubscriptionChange(e, selectedSeries) {
		if (e.target.checked) {
			const seriesToAdd = selectedSeries;
			seriesToAdd.group = { name: "Ungrouped", pos: 0 };
			const response = await addSubscriptions("tv", [seriesToAdd]);

			if (response.status === 201) {
				setIsSubscribed(true);
				dispatch({ type: "EDIT_SERIES", series: response.data[0] });
				dispatch({ type: "EDIT_GROUP_TOTAL", subscription: response.data[0], increment: 1 });
			}
		} else {
			const response = await deleteSubscription(selectedSeries._id, true);

			if (response.status === 200) {
				setIsSubscribed(false);
				dispatch({ type: "DELETE_SUBSCRIPTION", subscription: response.data });
				dispatch({ type: "EDIT_GROUP_TOTAL", subscription: response.data, increment: -1 });
			}
		}
	}

	async function handleMarkAsWatched(e, selectedSeries) {
		const isWatched = selectedSeries.numWatched > 0 && selectedSeries.numTotal === selectedSeries.numWatched;
		const response = await patchSubscription(selectedSeries.externalId, {
			markAsWatched: !isWatched,
			watched: "all",
		});

		if (response.status === 200) {
			dispatch({
				type: "EDIT_WATCH_NUMBERS",
				subscription: response.data,
				numToWatch: isWatched ? selectedSeries.numTotal : 0,
				numWatched: isWatched ? 0 : selectedSeries.numTotal,
			});
		}
	}

	async function handleGetProviders(selectedSeries) {
		const response = await getProviders(contentType, selectedSeries.displayName);

		if (response.status === 200) {
			setProviders(response.data);
		}
	}

	function handleNameClick() {
		if (originalSeriesVisible) {
			setOriginalSeriesVisible(false);
		} else {
			setOriginalSeriesVisible(true);
		}
	}

	const s = { ...seriesInfo[series.externalId], ...series };

	function getLink() {
		if (s.hasAsset) return `/tv/series/${s.externalId}`;

		return {
			pathname: s.imdbId
				? `https://www.imdb.com/title/${s.imdbId}`
				: `https://www.themoviedb.org/${s.contentType}/${s.externalId}`,
		};
	}

	return (
		<Box display="flex" flexDirection="column" width={bannerWidth} height="100%" className={classes.banner}>
			<Card component={Box} mb={1}>
				<CardActionArea>
					<Link
						to={getLink()}
						target={s.hasAsset ? "" : "_blank"}
						rel="noreferrer"
						style={{ textDecoration: "none" }}
					>
						{s.image ? (
							<CardMedia
								component="img"
								width="100%"
								image={s.image}
								style={{ display: "block", width: "100%", minHeight: "270px" }}
							/>
						) : (
							<Placeholder height={270} />
						)}
					</Link>
					<Zoom in={providers}>
						<Box
							style={{
								position: "absolute",
								bottom: "2px",
								right: "1px",
							}}
						>
							{providers && providers.length ? (
								providers.map(provider => (
									<a href={provider.url} target="_blank" rel="noreferrer" key={provider.url}>
										<img src={provider.icon} height="35px" style={{ margin: "2px", borderRadius: "2px" }} />
									</a>
								))
							) : (
								<i className="icon-close-circled icon-3x" />
							)}
						</Box>
					</Zoom>
					<Zoom in={isSubscribed && s.numToWatch > 0} className={actions ? classes.bannerEpCount : null}>
						<Chip
							color="secondary"
							size="small"
							label={s.contentType === "tv" ? s.numToWatch : "•"}
							style={{ position: "absolute", top: "5px", right: "5px", borderRadius: "2px" }}
						/>
					</Zoom>
					{actions ? (
						<>
							<div
								id={s.externalId}
								className={classes.bannerOptions}
								onClick={handleSetAnchorEl}
								style={{
									position: "absolute",
									top: "5px",
									right: "5px",
									borderRadius: "2px",
									backgroundColor: "#212121",
									padding: "4px",
									fontSize: "20px",
								}}
							>
								<i className="icon-more" />
							</div>
							<Menu
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={handleClose}
								getContentAnchorEl={null}
								anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
								transformOrigin={{ vertical: "top", horizontal: "right" }}
							>
								{menuOptions.map(option => (
									<MenuItem
										key={option.displayName}
										id={anchorEl && anchorEl.id}
										onClick={() => {
											option.onClick(s);
											handleClose();
										}}
									>
										{option.displayName}
									</MenuItem>
								))}
							</Menu>
						</>
					) : null}
					<Slide direction="right" timeout={750} in={isSubscribed && s.numWatched > 0}>
						<Tooltip title={`${s.numWatched} watched`} placement="top">
							<LinearProgress
								color="secondary"
								variant="determinate"
								value={(s.numWatched / s.numTotal) * 100}
								className={classes.watchedProgressBar}
							/>
						</Tooltip>
					</Slide>
				</CardActionArea>
			</Card>
			<Typography variant="body2" align="left" onClick={handleNameClick}>
				{s.displayName}
			</Typography>
			{s.originalSeries && originalSeriesVisible && (
				<Typography variant="caption" align="left">
					{`Because you watch ${s.originalSeries.displayName}`}
				</Typography>
			)}
			<Box display="flex" alignItems="center">
				<Typography variant="caption" style={{ display: "flex", flexGrow: 1, color: "#aeaeae" }}>
					{s.releaseDate
						? dayjs(s.releaseDate).get("year") === dayjs().get("year")
							? formatDate(s.releaseDate, "DD MMM")
							: dayjs(s.releaseDate).get("year")
						: s.year || null}
				</Typography>
				<Tooltip title={isSubscribed ? translate("removeFavorites") : translate("addFavorites")} placement="top">
					<Checkbox
						color="secondary"
						checked={isSubscribed}
						icon={<i className="icon-heart" style={{ fontSize: "0.875rem" }} />}
						checkedIcon={<i className="icon-heart" style={{ fontSize: "0.875rem" }} />}
						onChange={e => handleSubscriptionChange(e, s)}
						classes={{ root: classes.checkboxSize }}
					/>
				</Tooltip>
				<Tooltip
					title={
						isSubscribed && s.numWatched > 0 && s.numTotal === s.numWatched
							? translate("removeWatched")
							: translate("addWatched")
					}
					placement="top"
				>
					<Checkbox
						color="secondary"
						checked={isSubscribed && s.numWatched > 0 && s.numTotal === s.numWatched}
						disabled={!isSubscribed || !s.numTotal}
						icon={<i className="icon-eye" style={{ fontSize: "0.875rem" }} />}
						checkedIcon={<i className="icon-eye" style={{ fontSize: "0.875rem" }} />}
						onChange={e => handleMarkAsWatched(e, s)}
						classes={{ root: classes.checkboxSize }}
					/>
				</Tooltip>
				{s.rating ? (
					<Box display="flex" alignItems="center" color="#fbc005" height="100%" style={{ paddingRight: "5px" }}>
						<i className="icon-star" style={{ paddingLeft: "5px", paddingRight: "5px" }} />
						<Typography variant="caption">{s.rating}</Typography>
					</Box>
				) : null}
				{providers ? null : (
					<Tooltip title={"Providers"} placement="top">
						<IconButton onClick={() => handleGetProviders(s)} classes={{ root: classes.checkboxSize }}>
							<i className="icon-monitor" style={{ fontSize: "0.875rem" }} />
						</IconButton>
					</Tooltip>
				)}
			</Box>
		</Box>
	);
}

Banner.propTypes = {
	series: PropTypes.object.isRequired,
	contentType: PropTypes.string.isRequired,
	bannerWidth: PropTypes.number.isRequired,
	actions: PropTypes.bool,
};

export default Banner;
