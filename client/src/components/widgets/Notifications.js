import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";
import { motion } from "framer-motion";

import {
	makeStyles,
	Zoom,
	IconButton,
	Button,
	Menu,
	MenuItem,
	Box,
	Typography,
	ListItem,
	ListItemSecondaryAction,
	Avatar,
	Link,
	Badge,
	Checkbox,
} from "@material-ui/core";

import Loading from "../.partials/Loading";
import AnimatedList from "../.partials/AnimatedList";

import { NotificationContext } from "../../contexts/NotificationContext";
import { VideoPlayerContext } from "../../contexts/VideoPlayerContext";
import { UserContext } from "../../contexts/UserContext";

import { getNotifications, patchNotifications, deleteNotifications } from "../../api/notifications";
import { addToWatchLater } from "../../api/youtube";

import { formatDate, formatVideoDuration, formatNotification } from "../../utils/utils";
import { translate } from "../../utils/translations";

import { notifications as widgetStyles } from "../../styles/Widgets";
import { videoPlayer as videoPlayerStyles } from "../../styles/VideoPlayer";
import generalStyles from "../../styles/General";

const useStyles = makeStyles({ ...widgetStyles, ...videoPlayerStyles, ...generalStyles });

function Notifications({ height }) {
	const classes = useStyles();
	const { state, dispatch } = useContext(NotificationContext);
	const { notifications, total } = state;
	const videoPlayer = useContext(VideoPlayerContext);
	const { user } = useContext(UserContext);
	const [pagination, setPagination] = useState({
		loading: false,
		page: 0,
		hasMore: false,
		filter: "filter-all",
		history: false,
	});
	const [filterAnchorEl, setFilterAnchorEl] = useState(null);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
	const [selectedNotification, setSelectedNotification] = useState(null);
	const [actionLoading, setActionLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [selection, setSelection] = useState(false);
	const [selectedNotifications, setSelectedNotifications] = useState({});
	let isMounted = true;

	async function handleGetNotifications() {
		if (!pagination.loading) {
			setPagination(prev => ({ ...prev, loading: true }));

			let filter = pagination.filter.substring(7);
			filter = filter === "all" ? "" : filter;

			const after = pagination.page > 0 && notifications[notifications.length - 1]._id;

			const response = await getNotifications(after, pagination.history, filter);

			if (response.status === 200 && isMounted) {
				// prettier-ignore
				const newNotifications = pagination.page === 0
					? response.data.notifications
					: notifications.concat(response.data.notifications);

				dispatch({ type: "SET_NOTIFICATIONS", notifications: newNotifications, total: response.data.total });

				setPagination(prev => ({
					...prev,
					page: prev.page + 1,
					hasMore: !(response.data.notifications.length < 25),
					loading: false,
				}));
				setOpen(true);
			}
		}
	}

	useEffect(() => {
		async function fetchData() {
			await handleGetNotifications();
		}

		fetchData();

		return () => (isMounted = false); // eslint-disable-line
	}, [pagination.filter, pagination.history]); // eslint-disable-line

	async function handleHideNotification(notificationsToHide = [selectedNotification._id]) {
		setActionLoading(true);

		const response = pagination.history
			? await deleteNotifications(notificationsToHide)
			: await patchNotifications(notificationsToHide, false);

		if (response.status === 200) {
			dispatch({ type: "DELETE_NOTIFICATION", notifications: response.data });
			setSelectedNotifications({});
		}

		setActionLoading(false);
	}

	async function handleRestoreNotification(notificationsToRestore = [selectedNotification._id]) {
		setActionLoading(true);

		const response = await patchNotifications(notificationsToRestore, true);

		if (response.status === 200) {
			dispatch({ type: "DELETE_NOTIFICATION", notifications: response.data });
			setSelectedNotifications({});
		}

		setActionLoading(false);
	}

	async function handleWatchLaterOption() {
		setActionLoading(true);

		const response = await addToWatchLater([
			{
				_id: selectedNotification._id,
				videoId: selectedNotification.info.videoId,
				channelId: selectedNotification.info.channelId,
			},
		]);

		if (response.status === 200 || response.status === 400) {
			dispatch({ type: "DELETE_NOTIFICATION", notifications: response.data });
			setSelectedNotifications({});
		}

		setActionLoading(false);
	}

	function handleToggleHistory() {
		setPagination(prev => ({ ...prev, history: !prev.history, page: 0 }));
	}

	function applyFilter(filter) {
		setPagination(prev => ({ ...prev, filter, page: 0, hasMore: false }));
	}

	function handleClickListItem(e) {
		setFilterAnchorEl(e.currentTarget);
	}

	function handleMenuItemClick(e, index) {
		setFilterAnchorEl(null);
		setSelectedIndex(index);

		applyFilter(e.currentTarget.id);
	}

	function handleClose() {
		setFilterAnchorEl(null);
	}

	function handleOptionsClick(e, notification) {
		setNotificationAnchorEl(e.currentTarget);
		setSelectedNotification(notification);
	}

	function handleCloseOptions() {
		setNotificationAnchorEl(null);
	}

	function handleAddToVideoPlayer(videoSource, notification) {
		videoPlayer.dispatch({
			type: "ADD_VIDEO",
			videoSource,
			video: {
				name: notification.info.videoTitle,
				thumbnail: notification.info.thumbnail,
				url: `https://www.youtube.com/watch?v=${notification.info.videoId}`,
				channelName: notification.info.displayName,
				channelUrl: `https://www.youtube.com/channel/${notification.info.channelId}`,
			},
		});
	}

	function handleToggleSelection() {
		if (selection) setSelectedNotifications({});
		setSelection(prev => !prev);
	}

	function handleSelectNotification(notification) {
		const { _id, type, info } = notification;
		const newSelected = { ...selectedNotifications };

		if (_id in newSelected) {
			delete newSelected[_id];
		} else {
			newSelected[_id] = { type, videoId: info.videoId, channelId: info.channelId };
		}

		setSelectedNotifications(newSelected);
	}

	function handleHideBatch() {
		handleHideNotification(Object.keys(selectedNotifications));
	}

	function handleRestoreBatch() {
		handleRestoreNotification(Object.keys(selectedNotifications));
	}

	async function handleWatchLaterBatch() {
		const response = await addToWatchLater(
			Object.entries(selectedNotifications).map(([key, value]) => ({
				_id: key,
				videoId: value.videoId,
				channelId: value.channelId,
			})),
		);

		if (response.status === 200 || response.status === 400) {
			dispatch({ type: "DELETE_NOTIFICATION", notifications: response.data });
			setSelectedNotifications({});
		}
	}

	function renderBatchButtons() {
		if (Object.keys(selectedNotifications).length) {
			return pagination.history ? (
				<>
					<Button onClick={handleRestoreBatch}>{translate("restore")}</Button>
					<Button onClick={handleHideBatch}>{translate("delete")}</Button>
				</>
			) : (
				<>
					<Button onClick={handleHideBatch}>{translate("markAsRead")}</Button>
					{Object.values(selectedNotifications).every(v => v.type === "youtube") && (
						<Button onClick={handleWatchLaterBatch}>{translate("watchLater")}</Button>
					)}
				</>
			);
		}
		return null;
	}

	function renderNotificationType(type) {
		switch (type) {
			case "tv":
				return <i className="icon-monitor-filled" />;
			case "youtube":
				return <i className="icon-youtube-filled" />;
			default:
				return <i className="icon-notifications" />;
		}
	}

	function renderNotificationAction(notification) {
		if (selectedNotification && selectedNotification._id === notification._id && actionLoading) {
			return <Loading />;
		}

		return (
			<ListItemSecondaryAction id={notification._id} onClick={e => handleOptionsClick(e, notification)}>
				<IconButton edge="end">
					<i className="icon-more" />
				</IconButton>
			</ListItemSecondaryAction>
		);
	}

	function renderNotificationContent(notification) {
		const { thumbnail, overlay, title, subtitle } = formatNotification(notification);

		switch (notification.type) {
			case "youtube":
				return (
					<>
						{thumbnail ? (
							<Box position="relative" flexShrink="0" width="100px" mr={2} className={classes.videoThumbnail}>
								<img src={thumbnail} width="100%" alt="Video thumbnail" />
								<Typography variant="caption" className={classes.bottomRightOverlay}>
									{formatVideoDuration(overlay)}
								</Typography>
								<Box
									className={classes.videoPlayOverlay}
									display="flex"
									alignItems="center"
									justifyContent="center"
									onClick={() => handleAddToVideoPlayer("youtube", notification)}
								>
									<i className="icon-play icon-2x" />
								</Box>
							</Box>
						) : (
							<Box display="flex" justifyContent="center" flexShrink="0" width="100px" mr={2}>
								<Avatar className={classes.avatar}>{renderNotificationType(notification.type)}</Avatar>
							</Box>
						)}
						<Box display="flex" flexDirection="column" flex="1 1 auto" minWidth={0}>
							<Typography variant="body1" title={subtitle} noWrap>
								<Link
									href={`https://www.youtube.com/watch?v=${notification.info.videoId}`}
									target="_blank"
									rel="noreferrer"
									color="inherit"
								>
									{subtitle}
								</Link>
							</Typography>
							<Typography variant="body2" title={title} noWrap>
								<Link
									href={`https://www.youtube.com/channel/${notification.info.channelId}`}
									target="_blank"
									rel="noreferrer"
									color="inherit"
								>
									{title}
								</Link>
							</Typography>
							<Typography variant="caption">{formatDate(notification.dateToSend, "DD-MM-YYYY HH:mm")}</Typography>
						</Box>
					</>
				);
			case "tv":
				return (
					<>
						{thumbnail ? (
							<Box position="relative" flexShrink="0" width="100px" mr={2} className={classes.videoThumbnail}>
								<img src={thumbnail} width="100%" alt="Video thumbnail" />
								<Box className={classes.bottomRightOverlay}>
									<Typography variant="caption">{overlay}</Typography>
								</Box>
							</Box>
						) : (
							<Box display="flex" justifyContent="center" flexShrink="0" width="100px" mr={2}>
								<Avatar className={classes.avatar}>{renderNotificationType(notification.type)}</Avatar>
							</Box>
						)}
						<Box display="flex" flexDirection="column" flex="1 1 auto" minWidth={0}>
							<Typography variant="body1" title={title} noWrap>
								{title}
							</Typography>
							<Typography variant="body2" title={notification.info.episodeTitle || overlay} noWrap>
								{notification.info.episodeTitle || overlay}
							</Typography>
							<Typography variant="caption">{formatDate(notification.dateToSend, "DD-MM-YYYY HH:mm")}</Typography>
						</Box>
					</>
				);
			default:
				return null;
		}
	}

	function renderNotificationList() {
		const noNotificationVariant = {
			hidden: {
				y: -100,
				opacity: 0,
			},
			visible: {
				opacity: 1,
				y: 0,
				transition: {
					delay: 0.7,
					type: "spring",
				},
			},
		};

		if (notifications.length) {
			return (
				<AnimatedList>
					{notifications.map(notification => (
						<ListItem key={notification._id} divider>
							{selection && (
								<Checkbox
									style={{ marginRight: 10 }}
									checked={notification._id in selectedNotifications}
									onChange={() => handleSelectNotification(notification)}
								/>
							)}
							{renderNotificationContent(notification)}
							{!selection && renderNotificationAction(notification)}
						</ListItem>
					))}
				</AnimatedList>
			);
		}

		return (
			<Box display="flex" alignItems="center" justifyContent="center">
				<motion.h3 variants={noNotificationVariant} initial="hidden" animate="visible">
					{translate("noNotifications")}
				</motion.h3>
			</Box>
		);
	}

	function getNotificationActions() {
		if (selectedNotification) {
			if (pagination.history) {
				return [
					{ name: translate("restore"), onClick: handleRestoreNotification },
					{ name: translate("delete"), onClick: handleHideNotification },
				];
			}

			switch (selectedNotification.type) {
				case "youtube":
					const youtubeOptions = [{ name: translate("markAsRead"), onClick: handleHideNotification }];

					if (user.settings.youtube && user.settings.youtube.watchLaterPlaylist) {
						youtubeOptions.push({ name: translate("watchLater"), onClick: handleWatchLaterOption });
					}

					return youtubeOptions;
				default:
					return [{ name: translate("markAsRead"), onClick: handleHideNotification }];
			}
		}
		return [];
	}

	if (!open) return <Loading />;

	const filterOptions = [translate("all"), "TV", "Youtube", "Reddit", "Twitch"];
	const actions = getNotificationActions();

	return (
		<Zoom in={open}>
			<Box
				display="flex"
				flexDirection="column"
				className={classes.root}
				style={{ height: height ? height : "calc( 100vh - 200px )" }}
			>
				<Box display="flex" alignItems="center" className={classes.header}>
					<Box display="flex">
						<Typography variant="subtitle1">{translate("notifications")}</Typography>
					</Box>
					<Box display="flex" flexGrow={1}>
						<Badge className={classes.badge} color="secondary" badgeContent={total} max={999} />
					</Box>
					<Box display="flex" justifyContent="flex-end">
						{selection ? (
							renderBatchButtons()
						) : (
							<>
								<Button
									size="small"
									aria-controls="filter-menu"
									aria-haspopup="true"
									onClick={handleClickListItem}
									endIcon={<i className="icon-filter" />}
								>
									{filterOptions[selectedIndex]}
								</Button>
								<Menu
									id="filter-menu"
									anchorEl={filterAnchorEl}
									keepMounted
									open={Boolean(filterAnchorEl)}
									onClose={handleClose}
									getContentAnchorEl={null}
									anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
									transformOrigin={{ vertical: "top", horizontal: "right" }}
								>
									{filterOptions.map((option, index) => (
										<MenuItem
											key={option}
											id={`filter-${option.toLowerCase()}`}
											selected={index === selectedIndex}
											onClick={event => handleMenuItemClick(event, index)}
										>
											{option}
										</MenuItem>
									))}
								</Menu>
								<IconButton color="primary" onClick={handleToggleHistory}>
									<i className={`icon-${pagination.history ? "notifications" : "history"}`} />
								</IconButton>
							</>
						)}
						<Checkbox checked={selection} onChange={handleToggleSelection} style={{ margin: "3px 0" }} />
					</Box>
				</Box>
				<Box
					display="flex"
					flexWrap="wrap"
					alignItems={notifications.length ? "initial" : "center"}
					justifyContent="center"
					height="100%"
					style={{ overflow: "auto" }}
				>
					<InfiniteScroll
						style={{ minWidth: "100%" }}
						initialLoad={false}
						loadMore={handleGetNotifications}
						hasMore={pagination.hasMore}
						useWindow={false}
						loader={<Loading key={0} />}
					>
						{renderNotificationList()}
					</InfiniteScroll>
				</Box>
				<Menu
					anchorEl={notificationAnchorEl}
					keepMounted
					open={Boolean(notificationAnchorEl)}
					onClose={handleCloseOptions}
				>
					{actions.map(action => (
						<MenuItem
							key={action.name}
							onClick={() => {
								action.onClick();
								handleCloseOptions();
							}}
						>
							{action.name}
						</MenuItem>
					))}
				</Menu>
			</Box>
		</Zoom>
	);
}

Notifications.propTypes = {
	height: PropTypes.string,
};

export default Notifications;
