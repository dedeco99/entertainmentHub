import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";
import InfiniteScroll from "react-infinite-scroller";

import Zoom from "@material-ui/core/Zoom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import CustomScrollbar from "../.partials/CustomScrollbar";

import { getNotifications, patchNotifications, deleteNotifications } from "../../api/notifications";
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

			anchorEl: null,
			selectedIndex: 0,
			open: false,
		};

		this.getNotifications = this.getNotifications.bind(this);

		this.handleToggleHistory = this.handleToggleHistory.bind(this);
		this.handleClickListItem = this.handleClickListItem.bind(this);
		this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
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

	async handleHideNotification(id) {
		const { deleteNotification } = this.props;
		const { history } = this.state;

		const response = history ? await deleteNotifications(id) : await patchNotifications(id);

		if (response.data) {
			deleteNotification(response.data);
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
		this.setState({ anchorEl: e.currentTarget });
	}

	handleMenuItemClick(e, index) {
		this.setState({ anchorEl: null, selectedIndex: index });
		this.applyFilter(e.currentTarget.id);
	}

	handleClose() {
		this.setState({ anchorEl: null });
	}

	renderNotificationList() {
		const { notifications, classes } = this.props;
		const { history } = this.state;

		return (
			<List>
				{notifications.map(notification => {
					return (
						<ListItem key={notification._id} button divider>
							<ListItemAvatar>
								<Avatar className={classes.avatar}>
									{this.renderNotificationType(notification.type)}
								</Avatar>
							</ListItemAvatar>
							{this.renderNotificationContent(notification)}
							<ListItemSecondaryAction
								onClick={() => this.handleHideNotification(notification._id)}
							>
								<IconButton>
									<i className="material-icons">{history ? "delete" : "check_circle"}</i>
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem >
					);
				})}
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

	render() {
		const { height, classes } = this.props;
		const { hasMore, history, anchorEl, selectedIndex, open } = this.state;

		const options = ["All", "TV", "Youtube", "Reddit", "Twitch"];

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
								{options[selectedIndex]}
							</Button>
							<Menu
								id="filter-menu"
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={this.handleClose}
								getContentAnchorEl={null}
								anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
								transformOrigin={{ vertical: "top", horizontal: "right" }}
							>
								{options.map((option, index) => (
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
