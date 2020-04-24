import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

import Fade from "@material-ui/core/Fade";
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

import { youtube as styles } from "../../styles/Youtube";

class Subscriptions extends Component {
	constructor() {
		super();

		this.state = {
			checkedChannels: [],
		};

		this.addChannels = this.addChannels.bind(this);

		this.handleSubscriptionCheckbox = this.handleSubscriptionCheckbox.bind(this);
	}

	async addChannels() {
		const { addChannels } = this.props;
		const { checkedChannels } = this.state;

		await addChannels(checkedChannels);

		this.setState({ checkedChannels: [] });
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
				{subscriptions.map(channel => {
					const labelId = `checkbox-list-secondary-label-${channel.channelId}`;
					return (
						<ListItem key={channel.channelId} button onClick={() => this.handleSubscriptionCheckbox(channel.channelId)}>
							<ListItemAvatar>
								<Avatar alt={channel.title} /* src={channel.logo} */ />
							</ListItemAvatar>
							<ListItemText id={labelId} primary={channel.displayName} />
							<ListItemSecondaryAction>
								<Checkbox
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

	render() {
		const { classes, open, onClose } = this.props;

		return (
			<Modal
				className={classes.modal}
				open={open}
				onClose={onClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
			>
				<Fade in={open}>
					<Paper variant="outlined" className={classes.modalContent}>
						<Box display="flex" flexGrow={1} style={{ overflow: "auto" }}>
							{this.renderSubscriptionsList()}
						</Box>
						<Box display="flex" justifyContent="flex-end" className={classes.modalFooter}>
							<Button variant="contained" onClick={this.addChannels}>{"Submit"}</Button>
						</Box>
					</Paper>
				</Fade>
			</Modal>
		);
	}
}

Subscriptions.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	subscriptions: PropTypes.array.isRequired,
	addChannels: PropTypes.func.isRequired,
};

export default withStyles(styles)(Subscriptions);
