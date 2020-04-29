import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import InfiniteScroll from "react-infinite-scroller";

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
import CircularProgress from "@material-ui/core/CircularProgress";

import { youtube as styles } from "../../styles/Youtube";

class Follows extends Component {
	constructor() {
		super();

		this.state = {
			checkedChannels: [],
		};

		this.addChannels = this.addChannels.bind(this);

		this.handleCheckbox = this.handleCheckbox.bind(this);
	}

	async addChannels() {
		const { addChannels } = this.props;
		const { checkedChannels } = this.state;

		await addChannels(checkedChannels);

		this.setState({ checkedChannels: [] });
	}

	handleCheckbox(channelId) {
		const { follows } = this.props;
		const { checkedChannels } = this.state;

		const foundChannel = checkedChannels.findIndex(channel => channel.channelId === channelId);
		const updatedChannels = [...checkedChannels];

		if (foundChannel === -1) {
			const follow = follows.find(channel => channel.channelId === channelId);

			updatedChannels.push(follow);
		} else {
			updatedChannels.splice(foundChannel, 1);
		}

		this.setState({ checkedChannels: updatedChannels });
	}

	renderFollowsList() {
		const { classes, follows } = this.props;
		const { checkedChannels } = this.state;

		return (
			<List className={classes.root}>
				{follows.map(channel => {
					const labelId = `checkbox-list-secondary-label-${channel.id}`;
					return (
						<ListItem key={channel.id} button onClick={() => this.handleCheckbox(channel.id)}>
							<ListItemAvatar>
								<Avatar alt={channel.user} /* src={channel.logo} */ />
							</ListItemAvatar>
							<ListItemText id={labelId} primary={channel.user} />
							<ListItemSecondaryAction>
								<Checkbox
									edge="end"
									onChange={() => this.handleCheckbox(channel.id)}
									checked={Boolean(checkedChannels.find(c => c.id === channel.id))}
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
		const { classes, open, onClose, getFollows, hasMoreFollows } = this.props;

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
						<Box flexGrow={1} style={{ overflow: "auto" }}>
							<InfiniteScroll
								loadMore={getFollows}
								hasMore={hasMoreFollows}
								useWindow={false}
								loader={this.renderLoadingMore()}
							>
								{this.renderFollowsList()}
							</InfiniteScroll>
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

Follows.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	follows: PropTypes.array.isRequired,
	addChannels: PropTypes.func.isRequired,
	getFollows: PropTypes.func.isRequired,
	hasMoreFollows: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Follows);
