import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import InfiniteScroll from "react-infinite-scroller";
import { motion } from "framer-motion";

import Zoom from "@material-ui/core/Zoom";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import CircularProgress from "@material-ui/core/CircularProgress";

import AnimatedList from "../.partials/AnimatedList";

import { NotificationContext } from "../../contexts/NotificationContext";

import { getNotifications, patchNotifications, deleteNotifications } from "../../api/notifications";
import { addToWatchLater } from "../../api/youtube";
import { formatDate } from "../../utils/utils";

import { notifications as styles } from "../../styles/Widgets";

class Notifications extends Component {
	constructor() {
		super();

		this.state = {
			open: false,
			loading: false,
			page: 0,
			hasMore: false,

			currentFilter: "filter-all",
			history: false,

			filterAnchorEl: null,
			selectedIndex: 0,
			notificationAnchorEl: null,
			selectedNotification: null,

			actionLoading: false,
		};

		this.getNotifications = this.getNotifications.bind(this);

		this.handleToggleHistory = this.handleToggleHistory.bind(this);
		this.handleClickListItem = this.handleClickListItem.bind(this);
		this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleOptionsClick = this.handleOptionsClick.bind(this);
		this.handleCloseOptions = this.handleCloseOptions.bind(this);

		this.handleHideNotification = this.handleHideNotification.bind(this);
		this.handleRestoreNotification = this.handleRestoreNotification.bind(this);
		this.handleWatchLaterOption = this.handleWatchLaterOption.bind(this);
	}

	componentDidMount() {
		this.getNotifications();
	}

	async getNotifications() {
		const { notificationState, dispatch } = this.context;
		const { notifications } = notificationState;
		const { loading, currentFilter, page, history } = this.state;

		if (!loading) {
			this.setState({ loading: true });

			let filter = currentFilter.substring(7);
			filter = filter === "all" ? "" : filter;

			const response = await getNotifications(page, history, filter);

			if (response.data) {
				const newNotifications = page === 0
					? response.data.notifications
					: notifications.concat(response.data.notifications);

				dispatch({ type: "SET_NOTIFICATIONS", notifications: newNotifications, total: response.data.total });

				this.setState({
					open: true,
					page: page + 1,
					hasMore: !(response.data.notifications.length < 25),
					loading: false,
				});
			}
		}
	}

	async handleHideNotification() {
		const { dispatch } = this.context;
		const { selectedNotification, history } = this.state;

		this.setState({ actionLoading: true });

		const response = history
			? await deleteNotifications(selectedNotification._id)
			: await patchNotifications(selectedNotification._id, false);

		if (response.data) {
			dispatch({ type: "DELETE_NOTIFICATION", notification: response.data });
		}

		this.setState({ actionLoading: false });
	}

	async handleRestoreNotification() {
		const { dispatch } = this.context;
		const { selectedNotification } = this.state;

		this.setState({ actionLoading: true });

		const response = await patchNotifications(selectedNotification._id, true);

		if (response.data) {
			dispatch({ type: "DELETE_NOTIFICATION", notification: response.data });
		}

		this.setState({ actionLoading: false });
	}

	async handleWatchLaterOption() {
		const { selectedNotification } = this.state;

		this.setState({ actionLoading: true });

		const response = await addToWatchLater(selectedNotification.info.videoId);

		if (response.status === 200 || response.status === 409) {
			await this.handleHideNotification();
		}

		this.setState({ actionLoading: false });
	}

	handleToggleHistory() {
		const { history } = this.state;

		this.setState({ history: !history, page: 0 }, this.getNotifications);
	}

	applyFilter(filter) {
		this.setState({ currentFilter: filter, page: 0 }, this.getNotifications);
	}

	handleClickListItem(e) {
		this.setState({ filterAnchorEl: e.currentTarget });
	}

	handleMenuItemClick(e, index) {
		this.setState({ filterAnchorEl: null, selectedIndex: index });

		this.applyFilter(e.currentTarget.id);
	}

	handleClose() {
		this.setState({ filterAnchorEl: null });
	}

	handleOptionsClick(e, notification) {
		this.setState({ notificationAnchorEl: e.currentTarget, selectedNotification: notification });
	}

	handleCloseOptions() {
		this.setState({ notificationAnchorEl: null });
	}

	formatVideoDuration(duration) {
		if (!duration || duration === "P0D") return "Live";

		const values = duration.substring(2).slice(0, -1).split(/[HM]/g);
		for (let i = 1; i < values.length; i++) {
			if (values[i].length < 2) values[i] = `0${values[i]}`;
		}

		return values.join(":");
	}

	renderNotificationType(type) {
		switch (type) {
			case "tv":
				return <i className="material-icons">{"tv"}</i>;
			case "youtube":
				return <i className="icofont-youtube-play" />;
			default:
				return <i className="material-icons">{"notifications"}</i>;
		}
	}

	getNotificationContent(notification) {
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

	renderNotificationAction(notification) {
		const { selectedNotification, actionLoading } = this.state;

		if (selectedNotification && selectedNotification._id === notification._id && actionLoading) {
			return <CircularProgress />;
		}

		return (
			<ListItemSecondaryAction id={notification._id} onClick={e => this.handleOptionsClick(e, notification)}>
				<IconButton edge="end">
					<i className="material-icons">{"more_vert"}</i>
				</IconButton>
			</ListItemSecondaryAction>
		);
	}

	renderNotificationContent(notification) {
		const { classes } = this.props;

		switch (notification.type) {
			case "youtube":
				return (
					<>
						{notification.info.thumbnail ? (
							<Box position="relative" flexShrink="0" width="100px" mr={2}>
								<img src={notification.info.thumbnail} width="100%" alt="Video thumbnail" />
								<Box position="absolute" bottom="0" right="0" px={0.5} style={{ backgroundColor: "#212121DD" }}>
									<Typography variant="caption"> {this.formatVideoDuration(notification.info.duration)} </Typography>
								</Box>
							</Box>
						) : (
							<Box display="flex" justifyContent="center" flexShrink="0" width="100px" mr={2}>
								<Avatar className={classes.avatar}>
									{this.renderNotificationType(notification.type)}
								</Avatar>
							</Box>
						)}
						<Box display="flex" flexDirection="column" flex="1 1 auto" minWidth={0}>
							<Typography variant="body1" title={notification.info.videoTitle} noWrap>
								<Link href={`https://www.youtube.com/watch?v=${notification.info.videoId}`} target="_blank" rel="noreferrer" color="inherit">
									{notification.info.videoTitle}
								</Link>
							</Typography>
							<Typography variant="body2" title={notification.info.displayName} noWrap>
								<Link href={`https://www.youtube.com/channel/${notification.info.channelId}`} target="_blank" rel="noreferrer" color="inherit">
									{notification.info.displayName}
								</Link>
							</Typography>
							<Typography variant="caption"> {formatDate(notification.dateToSend, "DD-MM-YYYY HH:mm")} </Typography>
						</Box>
					</>
				);
			default:
				const { title, subtitle } = this.getNotificationContent(notification);

				return (
					<>
						<Box display="flex" justifyContent="center" flexShrink="0" width="100px" mr={2}>
							<Avatar className={classes.avatar}>
								{this.renderNotificationType(notification.type)}
							</Avatar>
						</Box>
						<Box display="flex" flexDirection="column" flex="1 1 auto" minWidth={0}>
							<Typography variant="body1" title={title} noWrap> {title} </Typography>
							<Typography variant="body2" title={subtitle} noWrap> {subtitle} </Typography>
							<Typography variant="caption"> {formatDate(notification.dateToSend, "DD-MM-YYYY HH:mm")} </Typography>
						</Box>
					</>
				);
		}
	}

	renderNotificationList() {
		const { notificationState } = this.context;
		const { notifications } = notificationState;

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
							{this.renderNotificationContent(notification)}
							{this.renderNotificationAction(notification)}
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

	renderLoadingMore() {
		return (
			<Box key={0} display="flex" alignItems="center" justifyContent="center">
				<CircularProgress />
			</Box>
		);
	}

	getNotificationActions() {
		const { selectedNotification, history } = this.state;

		if (selectedNotification) {
			if (history) {
				return [
					{ name: "Restore", onClick: this.handleRestoreNotification },
					{ name: "Delete", onClick: this.handleHideNotification },
				];
			}

			switch (selectedNotification.type) {
				case "youtube":
					return [
						{ name: "Mark as read", onClick: this.handleHideNotification },
						{ name: "Watch later", onClick: this.handleWatchLaterOption },
					];
				default:
					return [{ name: "Mark as read", onClick: this.handleHideNotification }];
			}
		}
		return [];
	}


	render() {
		const { notificationState } = this.context;
		const { notifications } = notificationState;
		const { classes, height } = this.props;
		const {
			open,
			hasMore,
			history,
			filterAnchorEl,
			selectedIndex,
			notificationAnchorEl,
		} = this.state;

		const filterOptions = ["All", "TV", "Youtube", "Reddit", "Twitch"];
		const actions = this.getNotificationActions();

		return (
			<Zoom in={open}>
				<Box display="flex" flexDirection="column" className={classes.root} style={{ height: height ? height : "calc( 100vh - 200px )" }}>
					<Box display="flex" alignItems="center" className={classes.header}>
						<Box display="flex" flexGrow={1}>
							<Typography variant="subtitle1">
								{"Notifications"}
							</Typography>
						</Box>
						<Box display="flex" justifyContent="flex-end">
							<Button
								size="small"
								aria-controls="filter-menu"
								aria-haspopup="true"
								onClick={this.handleClickListItem}
								endIcon={<i className="material-icons"> {"filter_list"} </i>}
							>
								{filterOptions[selectedIndex]}
							</Button>
							<Menu
								id="filter-menu"
								anchorEl={filterAnchorEl}
								keepMounted
								open={Boolean(filterAnchorEl)}
								onClose={this.handleClose}
								getContentAnchorEl={null}
								anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
								transformOrigin={{ vertical: "top", horizontal: "right" }}
							>
								{filterOptions.map((option, index) => (
									<MenuItem
										key={option}
										id={`filter-${option.toLowerCase()}`}
										selected={index === selectedIndex}
										onClick={event => this.handleMenuItemClick(event, index)}
									>
										{option}
									</MenuItem>
								))}
							</Menu>
							<IconButton color="primary" onClick={this.handleToggleHistory}>
								<i className="material-icons">
									{history ? "notifications" : "history"}
								</i>
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
							loadMore={this.getNotifications}
							hasMore={hasMore}
							useWindow={false}
							loader={this.renderLoadingMore()}
						>
							{this.renderNotificationList()}
						</InfiniteScroll>
					</Box>
					<Menu
						anchorEl={notificationAnchorEl}
						keepMounted
						open={Boolean(notificationAnchorEl)}
						onClose={this.handleCloseOptions}
					>
						{
							actions.map(action => (
								<MenuItem
									key={action.name}
									onClick={() => {
										action.onClick();
										this.handleCloseOptions();
									}}
								>
									{action.name}
								</MenuItem>
							))
						}
					</Menu>
				</Box>
			</Zoom >
		);
	}
}

Notifications.contextType = NotificationContext;

Notifications.propTypes = {
	classes: PropTypes.object.isRequired,
	height: PropTypes.string,
};

export default withStyles(styles)(Notifications);
