import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import InfiniteScroll from "react-infinite-scroller";

import IconButton from "@material-ui/core/IconButton";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { youtube as styles } from "../../styles/Youtube";

class Subscriptions extends Component {
	constructor() {
		super();

		this.state = {
			checkedChannels: [],

			openModal: false,
		};

		this.addChannels = this.addChannels.bind(this);

		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleSubscriptionCheckbox = this.handleSubscriptionCheckbox.bind(this);
	}

	async addChannels() {
		const { addChannels } = this.props;
		const { checkedChannels } = this.state;

		await addChannels(checkedChannels);

		this.setState({ checkedChannels: [] });
	}

	handleOpenModal() {
		this.setState({ openModal: true });
	}

	handleCloseModal() {
		this.setState({ openModal: false });
	}

	handleSubscriptionCheckbox(channelId) {
		const { subscriptions } = this.props;
		const { checkedChannels } = this.state;

		const foundChannel = checkedChannels.findIndex(channel => channel.channelId === channelId);
		const updatedChannels = [...checkedChannels];

		if (foundChannel === -1) {
			const subscription = subscriptions.find(channel => channel.channelId === channelId);

			updatedChannels.push(subscription);
		} else {
			updatedChannels.splice(foundChannel, 1);
		}

		this.setState({ checkedChannels: updatedChannels });
	}

	renderSubscriptionsList() {
		const { classes, subscriptions } = this.props;
		const { checkedChannels } = this.state;

		return (
			<List className={classes.root}>
				{subscriptions && subscriptions.map(channel => {
					const labelId = `checkbox-list-secondary-label-${channel.channelId}`;
					return (
						<ListItem key={channel.channelId} button onClick={() => this.handleSubscriptionCheckbox(channel.channelId)}>
							<ListItemAvatar>
								<Avatar alt={channel.title} src={channel.logo} />
							</ListItemAvatar>
							<ListItemText id={labelId} primary={channel.displayName} />
							<ListItemSecondaryAction>
								<Checkbox
									color="primary"
									edge="end"
									onChange={() => this.handleSubscriptionCheckbox(channel.channelId)}
									checked={Boolean(checkedChannels.find(c => c.channelId === channel.channelId))}
									inputProps={{ "aria-labelledby": labelId }}
								/>
							</ListItemSecondaryAction>
						</ListItem>
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
		const { openModal } = this.state;
		const { classes, getSubscriptions, hasMoreSubscriptions } = this.props;

		return (
			<div>
				<IconButton color="primary" onClick={this.handleOpenModal}>
					<i className="icofont-ui-add" />
				</IconButton>
				<Modal
					className={classes.modal}
					open={openModal}
					onClose={this.handleCloseModal}
					closeAfterTransition
					BackdropComponent={Backdrop}
				>
					<Paper variant="outlined" className={classes.modalContent}>
						<Box flexGrow={1} style={{ overflow: "auto" }}>
							<InfiniteScroll
								loadMore={getSubscriptions}
								hasMore={hasMoreSubscriptions}
								useWindow={false}
								loader={this.renderLoadingMore()}
							>
								{this.renderSubscriptionsList()}
							</InfiniteScroll>
						</Box>
						<Box display="flex" justifyContent="flex-end" className={classes.modalFooter}>
							<Button color="primary" variant="contained" onClick={this.addChannels}>{"Submit"}</Button>
						</Box>
					</Paper>
				</Modal>
			</div>
		);
	}
}

Subscriptions.propTypes = {
	classes: PropTypes.object.isRequired,
	subscriptions: PropTypes.array.isRequired,
	addChannels: PropTypes.func.isRequired,
	getSubscriptions: PropTypes.func.isRequired,
	hasMoreSubscriptions: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Subscriptions);
