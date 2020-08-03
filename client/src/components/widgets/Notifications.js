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
} from "@material-ui/core";

import Loading from "../.partials/Loading";
import AnimatedList from "../.partials/AnimatedList";

import { NotificationContext } from "../../contexts/NotificationContext";

import { getNotifications, patchNotifications, deleteNotifications } from "../../api/notifications";
import { addToWatchLater } from "../../api/youtube";

import { formatDate, formatVideoDuration } from "../../utils/utils";

import { notifications as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function Notifications({ height }) {
	const classes = useStyles();
	const { notificationState, dispatch } = useContext(NotificationContext);
	const { notifications } = notificationState;
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

	async function handleGetNotifications() {
		if (!pagination.loading) {
			setPagination({ ...pagination, loading: true });

			let filter = pagination.filter.substring(7);
			filter = filter === "all" ? "" : filter;

			console.log(pagination);

			const response = await getNotifications(pagination.page, pagination.history, filter);

			if (response.status === 200) {
				// prettier-ignore
				const newNotifications = pagination.page === 0
					? response.data.notifications
					: notifications.concat(response.data.notifications);

				dispatch({ type: "SET_NOTIFICATIONS", notifications: newNotifications, total: response.data.total });

				setPagination({
					...pagination,
					page: pagination.page + 1,
					hasMore: !(response.data.notifications.length < 25),
					loading: false,
				});
				setOpen(true);
			}
		}
	}

	useEffect(() => {
		handleGetNotifications();
	}, [pagination.filter, pagination.history]); // eslint-disable-line

	async function handleHideNotification() {
		setActionLoading(true);

		const response = pagination.history
			? await deleteNotifications(selectedNotification._id)
			: await patchNotifications(selectedNotification._id, false);

		if (response.status === 200) {
			dispatch({ type: "DELETE_NOTIFICATION", notification: response.data });
		}

		setActionLoading(false);
	}

	async function handleRestoreNotification() {
		setActionLoading(true);

		const response = await patchNotifications(selectedNotification._id, true);

		if (response.status === 200) {
			dispatch({ type: "DELETE_NOTIFICATION", notification: response.data });
		}

		setActionLoading(false);
	}

	async function handleWatchLaterOption() {
		setActionLoading(true);

		const response = await addToWatchLater(selectedNotification.info.videoId);

		if (response.status === 200 || response.status === 409) {
			await handleHideNotification();
		}

		setActionLoading(false);
	}

	function handleToggleHistory() {
		setPagination({ ...pagination, history: !pagination.history, page: 0 });
	}

	function applyFilter(filter) {
		setPagination({ ...pagination, filter, page: 0 });
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

	function renderNotificationType(type) {
		switch (type) {
			case "tv":
				return <i className="material-icons">{"tv"}</i>;
			case "youtube":
				return <i className="icofont-youtube-play" />;
			default:
				return <i className="material-icons">{"notifications"}</i>;
		}
	}

	function getNotificationContent(notification) {
		const { displayName, season, number } = notification.info;

		switch (notification.type) {
			case "tv":
				const seasonLabel = season > 9 ? `S${season}` : `S0${season}`;
				const episodeLabel = number > 9 ? `E${number}` : `E0${number}`;

				return {
					title: displayName,
					subtitle: `${seasonLabel}${episodeLabel}`,
				};
			default:
				return {
					title: <i className="material-icons">{notification.info.message}</i>,
					subtitle: "Message",
				};
		}
	}

	function renderNotificationAction(notification) {
		if (selectedNotification && selectedNotification._id === notification._id && actionLoading) {
			return <Loading />;
		}

		return (
			<ListItemSecondaryAction id={notification._id} onClick={e => handleOptionsClick(e, notification)}>
				<IconButton edge="end">
					<i className="material-icons">{"more_vert"}</i>
				</IconButton>
			</ListItemSecondaryAction>
		);
	}

	function renderNotificationContent(notification) {
		switch (notification.type) {
			case "youtube":
				return (
					<>
						{notification.info.thumbnail ? (
							<Box position="relative" flexShrink="0" width="100px" mr={2}>
								<img src={notification.info.thumbnail} width="100%" alt="Video thumbnail" />
								<Box position="absolute" bottom="0" right="0" px={0.5} style={{ backgroundColor: "#212121DD" }}>
									<Typography variant="caption"> {formatVideoDuration(notification.info.duration)} </Typography>
								</Box>
							</Box>
						) : (
							<Box display="flex" justifyContent="center" flexShrink="0" width="100px" mr={2}>
								<Avatar className={classes.avatar}>{renderNotificationType(notification.type)}</Avatar>
							</Box>
						)}
						<Box display="flex" flexDirection="column" flex="1 1 auto" minWidth={0}>
							<Typography variant="body1" title={notification.info.videoTitle} noWrap>
								<Link
									href={`https://www.youtube.com/watch?v=${notification.info.videoId}`}
									target="_blank"
									rel="noreferrer"
									color="inherit"
								>
									{notification.info.videoTitle}
								</Link>
							</Typography>
							<Typography variant="body2" title={notification.info.displayName} noWrap>
								<Link
									href={`https://www.youtube.com/channel/${notification.info.channelId}`}
									target="_blank"
									rel="noreferrer"
									color="inherit"
								>
									{notification.info.displayName}
								</Link>
							</Typography>
							<Typography variant="caption">
								{" "}
								{formatDate(notification.dateToSend, "DD-MM-YYYY HH:mm")}{" "}
							</Typography>
						</Box>
					</>
				);
			default:
				const { title, subtitle } = getNotificationContent(notification);

				return (
					<>
						<Box display="flex" justifyContent="center" flexShrink="0" width="100px" mr={2}>
							<Avatar className={classes.avatar}>{renderNotificationType(notification.type)}</Avatar>
						</Box>
						<Box display="flex" flexDirection="column" flex="1 1 auto" minWidth={0}>
							<Typography variant="body1" title={title} noWrap>
								{" "}
								{title}{" "}
							</Typography>
							<Typography variant="body2" title={subtitle} noWrap>
								{" "}
								{subtitle}{" "}
							</Typography>
							<Typography variant="caption">
								{" "}
								{formatDate(notification.dateToSend, "DD-MM-YYYY HH:mm")}{" "}
							</Typography>
						</Box>
					</>
				);
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
							{renderNotificationContent(notification)}
							{renderNotificationAction(notification)}
						</ListItem>
					))}
				</AnimatedList>
			);
		}

		return (
			<Box display="flex" alignItems="center" justifyContent="center">
				<motion.h3 variants={noNotificationVariant} initial="hidden" animate="visible">
					{"You have no notifications"}
				</motion.h3>
			</Box>
		);
	}

	function getNotificationActions() {
		if (selectedNotification) {
			if (pagination.history) {
				return [
					{ name: "Restore", onClick: handleRestoreNotification },
					{ name: "Delete", onClick: handleHideNotification },
				];
			}

			switch (selectedNotification.type) {
				case "youtube":
					return [
						{ name: "Mark as read", onClick: handleHideNotification },
						{ name: "Watch later", onClick: handleWatchLaterOption },
					];
				default:
					return [{ name: "Mark as read", onClick: handleHideNotification }];
			}
		}
		return [];
	}

	if (!open) return <Loading />;

	const filterOptions = ["All", "TV", "Youtube", "Reddit", "Twitch"];
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
					<Box display="flex" flexGrow={1}>
						<Typography variant="subtitle1">{"Notifications"}</Typography>
					</Box>
					<Box display="flex" justifyContent="flex-end">
						<Button
							size="small"
							aria-controls="filter-menu"
							aria-haspopup="true"
							onClick={handleClickListItem}
							endIcon={<i className="material-icons"> {"filter_list"} </i>}
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
							<i className="material-icons">{pagination.history ? "notifications" : "history"}</i>
						</IconButton>
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
