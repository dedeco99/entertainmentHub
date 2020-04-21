import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import { youtube as styles } from "../../styles/Youtube";

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
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import { getSubscriptions } from "../../api/youtube";

class Youtube extends Component {
	constructor() {
		super();

		this.state = {
			subscriptions: [],
			checkedChannels: [],
			openModal: false,

			page: 0,
			after: null,
		};

		this.getSubscriptions = this.getSubscriptions.bind(this);

		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleSubscriptionCheckbox = this.handleSubscriptionCheckbox.bind(this);
	}

	async componentDidMount() {
		await this.getSubscriptions();
	}

	async getSubscriptions() {
		const { subscriptions, page, after } = this.state;

		const response = await getSubscriptions(after);

		if (response.data && response.data.length) {
			const newSubscriptions = page === 0 ? response.data : subscriptions.concat(response.data);

			this.setState({ subscriptions: newSubscriptions, page: page + 1, after: response.data[0].after });
		}
	}

	handleOpenModal() {
		this.setState({ openModal: true });
	}

	handleCloseModal() {
		this.setState({ openModal: false });
	}

	handleSubscriptionCheckbox(channelId) {
		const { checkedChannels } = this.state;
		const currentIndex = checkedChannels.indexOf(channelId);
		const newChecked = [...checkedChannels];

		if (currentIndex === -1) {
			newChecked.push(channelId);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		this.setState({ checkedChannels: newChecked });
	}

	renderSubscriptionsList() {
		const { classes } = this.props;
		const { subscriptions, checkedChannels } = this.state;

		return (
			<List className={classes.root}>
				{subscriptions.map(channel => {
					const labelId = `checkbox-list-secondary-label-${channel.channelId}`;
					return (
						<ListItem key={channel.channelId} button onClick={() => this.handleSubscriptionCheckbox(channel.channelId)}>
							<ListItemAvatar> <Avatar alt={channel.title} src={channel.logo} /> </ListItemAvatar>
							<ListItemText id={labelId} primary={channel.displayName} />
							<ListItemSecondaryAction>
								<Checkbox
									edge="end"
									onChange={() => this.handleSubscriptionCheckbox(channel.channelId)}
									checked={checkedChannels.indexOf(channel.channelId) !== -1}
									inputProps={{ "aria-labelledby": labelId }}
								/>
							</ListItemSecondaryAction>
						</ListItem>
					);
				})}
			</List>
		);
	}

	render() {
		const { classes } = this.props;
		const { openModal } = this.state;

		return (
			<div>
				<IconButton onClick={this.handleOpenModal}>
					<i className="icofont-ui-add" />
				</IconButton>
				<Modal
					className={classes.modal}
					open={openModal}
					onClose={this.handleCloseModal}
					closeAfterTransition
					BackdropComponent={Backdrop}
				>
					<Fade in={openModal}>
						<Paper variant="outlined" className={classes.modalContent}>
							<Box display="flex" flexGrow={1} style={{ overflow: "auto" }}>
								{this.renderSubscriptionsList()}
							</Box>
							<Box display="flex" justifyContent="flex-end" className={classes.modalFooter}>
								<Button variant="contained">{"Submit"}</Button>
							</Box>
						</Paper>
					</Fade>
				</Modal>
			</div>
		);
	}
}

Youtube.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Youtube);
