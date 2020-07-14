import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";

import Sidebar from "../.partials/Sidebar";
import Subscriptions from "../.partials/Subscriptions";

import { getSubscriptions } from "../../api/youtube";
import { getChannels, addChannels, deleteChannel } from "../../api/channels";

import { youtube as styles } from "../../styles/Youtube";

class Youtube extends Component {
	constructor() {
		super();

		this.state = {
			channels: [],
			subscriptions: [],
			hasMoreSubscriptions: false,
			page: 0,
			after: null,

			openModal: false,
		};

		this.getSubscriptions = this.getSubscriptions.bind(this);
		this.addChannels = this.addChannels.bind(this);
		this.deleteChannel = this.deleteChannel.bind(this);

		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
	}

	async componentDidMount() {
		await this.getChannels();
		await this.getSubscriptions();
	}

	async getSubscriptions() {
		const { channels, subscriptions, page, after } = this.state;

		const response = await getSubscriptions(after);

		if (response.data && response.data.length) {
			const newSubscriptions = page === 0 ? response.data : subscriptions.concat(response.data);

			this.setState({
				subscriptions: newSubscriptions.filter(s => !channels.map(c => c.channelId).includes(s.channelId)),
				page: page + 1,
				after: response.data[0].after,
				hasMoreSubscriptions: !(response.data.length < 25),
			});
		}
	}

	async getChannels() {
		const response = await getChannels("youtube");

		if (response.data && response.data.length) {
			this.setState({ channels: response.data });
		}
	}

	async addChannels(channels) {
		const response = await addChannels("youtube", channels);

		if (response.status < 400) {
			this.setState(prevState => ({
				channels: [...prevState.channels, ...response.data].sort((a, b) => (
					a.displayName.toLowerCase() <= b.displayName.toLowerCase() ? -1 : 1
				)),
				subscriptions: prevState.subscriptions.filter(s => (
					![...prevState.channels, ...response.data].map(c => c.channelId).includes(s.channelId)
				)),
			}));
		}
	}

	async deleteChannel(e) {
		const { channels } = this.state;

		const response = await deleteChannel(e.target.id);

		if (response.status < 400) {
			const updatedChannels = channels.filter(s => s._id !== response.data._id);

			this.setState({ channels: updatedChannels, page: 0, after: null }, this.getSubscriptions);
		}
	}

	handleOpenModal() {
		this.setState({ openModal: true });
	}

	handleCloseModal() {
		this.setState({ openModal: false });
	}

	render() {
		const { openModal } = this.state;
		const { loadingChannels, channels, subscriptions, hasMoreSubscriptions } = this.state;

		const menuOptions = [{ displayName: "Delete", onClick: this.deleteChannel }];

		return (
			<Grid container spacing={2}>
				<Grid item sm={3} md={2}>
					<IconButton color="primary" onClick={this.handleOpenModal}>
						<i className="icofont-ui-add" />
					</IconButton>
					<Sidebar
						options={channels}
						idField="_id"
						menu={menuOptions}
						loading={loadingChannels}
						noResultsMessage={"No channels"}
					/>
				</Grid>
				<Grid item sm={9} md={10} lg={10} />
				<Subscriptions
					open={openModal}
					onClose={this.handleCloseModal}
					subscriptions={subscriptions}
					getSubscriptions={this.getSubscriptions}
					hasMoreSubscriptions={hasMoreSubscriptions}
					addChannels={this.addChannels}
				/>
			</Grid>
		);
	}
}

Youtube.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Youtube);
