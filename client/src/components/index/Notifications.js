import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Zoom from "@material-ui/core/Zoom";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { formatDate } from "../../utils/utils";

import { getNotifications, patchNotifications, deleteNotifications } from "../../actions/notifications";

class Notifications extends Component {
	constructor() {
		super();
		this.state = {
			currentFilter: "filter-all",
			history: false,

			anchorEl: null,
			selectedIndex: 0,
			open: false,
		};

		this.toggleHistory = this.toggleHistory.bind(this);
		this.handleClickListItem = this.handleClickListItem.bind(this);
		this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	componentDidMount() {
		this.getNotifications();
	}

	async getNotifications() {
		let { currentFilter } = this.state;
		const { history } = this.state;
		const { addNotification } = this.props;

		currentFilter = currentFilter.substring(7);
		currentFilter = currentFilter === "all" ? "" : currentFilter;

		const response = await getNotifications(history, currentFilter);

		if (response.data) {
			addNotification(response.data);
		}

		this.setState({ open: true });
	}

	async hideNotification(id) {
		const { deleteNotification } = this.props;
		const { history } = this.state;

		const response = history ? await deleteNotifications(id) : await patchNotifications(id);

		if (response.data) {
			deleteNotification(response.data);
		}
	}

	toggleHistory() {
		const { history } = this.state;
		this.setState({ history: !history }, this.getNotifications);
	}

	applyFilter(filter) {
		this.setState({ currentFilter: filter }, this.getNotifications);
	}

	renderNotificationType(type) {
		switch (type) {
			case "tv":
				return <i className="material-icons">{"tv"}</i>;
			default:
				return <i className="material-icons">{"notifications"}</i>;
		}
	}

	renderNotificationMessage(notification) {
		switch (notification.type) {
			case "tv":
				const { displayName, season, number } = notification.info;
				const seasonLabel = season > 9 ? `S${season}` : `S0${season}`;
				const episodeLabel = number > 9 ? `E${number}` : `E0${number}`;

				return `${displayName} - ${seasonLabel}${episodeLabel}`;
			default:
				return <i className="material-icons">{notification.info.message}</i>;
		}
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

	render() {
		const { notifications, height } = this.props;
		const { history, anchorEl, selectedIndex, open } = this.state;

		const options = ["All", "TV", "Reddit", "Twitch"];

		const notificationList = notifications.map(notification => {
			const notificationText = this.renderNotificationMessage(notification);

			return (
				<ListItem key={notification._id} button divider>
					<ListItemAvatar>
						<Avatar style={{ backgroundColor: "#444" }}>
							{this.renderNotificationType(notification.type)}
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={notificationText}
						title={notificationText}
						secondary={formatDate(notification.dateToSend, "DD-MM-YYYY HH:mm")}
						primaryTypographyProps={{ noWrap: true }}
					/>
					<ListItemSecondaryAction
						onClick={() => this.hideNotification(notification._id)}
					>
						<IconButton edge="end">
							<i className="material-icons">{history ? "delete" : "check_circle"}</i>
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem >
			);
		});

		return (
			<Zoom in={open}>
				<List
					style={{
						backgroundColor: "#222",
						height: height ? height : "calc( 100vh - 200px )",
						overflow: "auto",
					}}
				>
					<ListSubheader
						style={{ top: "-8px", paddingTop: "5px", height: "35px" }}
					>
						{"Notifications"}

						<IconButton edge="end" style={{ float: "right" }} onClick={this.toggleHistory}>
							<i className="material-icons">
								{history ? "notifications" : "history"}
							</i>
						</IconButton>

						<Button
							style={{ float: "right", padding: "12px" }}
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
					</ListSubheader>
					{notificationList}
				</List>
			</Zoom >
		);
	}
}

Notifications.propTypes = {
	notifications: PropTypes.array,
	addNotification: PropTypes.func,
	deleteNotification: PropTypes.func,
	height: PropTypes.string,
};

const mapStateToProps = state => ({
	notifications: state.notifications.notifications,
});

const mapDispatchToProps = dispatch => ({
	addNotification: notification => dispatch({ type: "ADD_NOTIFICATION", notification }),
	deleteNotification: notification => dispatch({ type: "DELETE_NOTIFICATION", notification }),
});


export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
