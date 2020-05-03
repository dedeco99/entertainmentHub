import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import InfiniteScroll from "react-infinite-scroller";

import Zoom from "@material-ui/core/Zoom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import { getNotifications, patchNotifications, deleteNotifications } from "../../api/notifications";
import { addToWatchLater } from "../../api/youtube";
import { formatDate } from "../../utils/utils";

import { notifications as styles } from "../../styles/Widgets";

class Notifications extends Component {
	constructor() {
		super();
		this.state = {
			page: 0,
			hasMore: false,
			loading: false,
			currentFilter: "filter-all",
			history: false,

			filterAnchorEl: null,
			selectedIndex: 0,
			open: false,

			notificationAnchorEl: null,
			selectedNotification: null,
		};

		this.getNotifications = this.getNotifications.bind(this);

		this.handleToggleHistory = this.handleToggleHistory.bind(this);
		this.handleClickListItem = this.handleClickListItem.bind(this);
		this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleOptionsClick = this.handleOptionsClick.bind(this);
		this.handleCloseOptions = this.handleCloseOptions.bind(this);

		this.handleHideNotification = this.handleHideNotification.bind(this);
		this.handleWatchLaterOption = this.handleWatchLaterOption.bind(this);
	}

	componentDidMount() {
		this.getNotifications();
	}

	async getNotifications() {
		const { page, history, loading } = this.state;
		const { notifications, addNotification, updateTotal } = this.props;

		if (!loading) {
			this.setState({ loading: true });

			let { currentFilter } = this.state;
			currentFilter = currentFilter.substring(7);
			currentFilter = currentFilter === "all" ? "" : currentFilter;

			const response = await getNotifications(page, history, currentFilter);

			if (response.data) {
				const newNotifications = page === 0
					? response.data.notifications
					: notifications.concat(response.data.notifications);

				addNotification(newNotifications);
				updateTotal(response.data.total);

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
		const { deleteNotification } = this.props;
		const { history, selectedNotification } = this.state;

		const response = history
			? await deleteNotifications(selectedNotification._id)
			: await patchNotifications(selectedNotification._id);

		if (response.data) {
			deleteNotification(response.data);
		}
	}

	async handleWatchLaterOption() {
		const { selectedNotification } = this.state;

		const response = await addToWatchLater(selectedNotification.info.videoId);

		if (response.data) {
			await this.handleHideNotification();
		}
	}

	handleToggleHistory() {
		const { history } = this.state;

		this.setState({ history: !history, page: 0 }, this.getNotifications);
	}

	applyFilter(filter) {
		this.setState({ currentFilter: filter, page: 0 }, this.getNotifications);
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
		const { displayName, season, number, videoTitle } = notification.info;

		switch (notification.type) {
			case "tv":
				const seasonLabel = season > 9 ? `S${season}` : `S0${season}`;
				const episodeLabel = number > 9 ? `E${number}` : `E0${number}`;

				return {
					title: displayName,
					subtitle: `${seasonLabel}${episodeLabel}`,
				};
			case "youtube":
				return {
					title: displayName,
					subtitle: videoTitle,
				};
			default:
				return {
					title: <i className="material-icons">{notification.info.message}</i>,
					subtitle: "Message",
				};
		}
	}

	renderNotificationContent(notification) {
		const { title, subtitle } = this.getNotificationContent(notification);

		return (
			<Box display="flex" flexDirection="column" flex="1 1 auto" minWidth={0}>
				<Typography variant="body1" title={title} noWrap> {title} </Typography>
				<Typography variant="body2" title={subtitle} noWrap> {subtitle} </Typography>
				<Typography variant="caption"> {formatDate(notification.dateToSend, "DD-MM-YYYY HH:mm")} </Typography>
			</Box>
		);
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

	renderNotificationList() {
		const { notifications, classes } = this.props;

		return (
			<List>
				{notifications.map(notification => (
					<ListItem key={notification._id} button divider>
						<ListItemAvatar>
							<Avatar className={classes.avatar}>
								{this.renderNotificationType(notification.type)}
							</Avatar>
						</ListItemAvatar>
						{this.renderNotificationContent(notification)}
						<ListItemSecondaryAction onClick={e => this.handleOptionsClick(e, notification)}>
							<IconButton edge="end">
								<i className="material-icons">{"more_vert"}</i>
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem >
				))}
			</List>
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
		const { selectedNotification } = this.state;
		if (selectedNotification) {
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
		const { height, classes } = this.props;
		const { hasMore, history, filterAnchorEl, selectedIndex, open, notificationAnchorEl } = this.state;

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
							<IconButton onClick={this.handleToggleHistory}>
								<i className="material-icons">
									{history ? "notifications" : "history"}
								</i>
							</IconButton>
						</Box>
					</Box>
					<Box style={{ overflow: "auto" }}>
						<InfiniteScroll
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
									onClick={() => { action.onClick(); this.handleCloseOptions(); }}
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

Notifications.propTypes = {
	classes: PropTypes.object.isRequired,
	notifications: PropTypes.array.isRequired,
	addNotification: PropTypes.func.isRequired,
	deleteNotification: PropTypes.func.isRequired,
	updateTotal: PropTypes.func.isRequired,
	height: PropTypes.string,
};

const mapStateToProps = state => ({
	notifications: state.notifications.notifications,
});

const mapDispatchToProps = dispatch => ({
	addNotification: notification => dispatch({ type: "ADD_NOTIFICATION", notification }),
	deleteNotification: notification => dispatch({ type: "DELETE_NOTIFICATION", notification }),
	updateTotal: total => dispatch({ type: "UPDATE_TOTAL", total }),
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Notifications));
