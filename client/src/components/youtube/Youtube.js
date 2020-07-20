import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

import Grid from "@material-ui/core/Grid";

import Sidebar from "../.partials/Sidebar";
import Subscriptions from "../.partials/Subscriptions";
import ChannelGroupDetail from "./ChannelGroupDetail";

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
		};

		this.getSubscriptions = this.getSubscriptions.bind(this);
		this.addChannels = this.addChannels.bind(this);
		this.deleteChannel = this.deleteChannel.bind(this);
	}

	async componentDidMount() {
		await this.getChannels();
		await this.getSubscriptions();
	}

	async getSubscriptions() {
		const { history } = this.props;
		const { channels, subscriptions, page, after } = this.state;

		const response = await getSubscriptions(after);

		if (response.status === 401) return history.push("/settings");

		if (response.data && response.data.length) {
			const newSubscriptions = page === 0 ? response.data : subscriptions.concat(response.data);

			this.setState({
				subscriptions: newSubscriptions.filter(s => !channels.map(c => c.channelId).includes(s.channelId)),
				page: page + 1,
				after: response.data[0].after,
				hasMoreSubscriptions: !(response.data.length < 25),
			});
		}

		return null;
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

	render() {
		const { loadingChannels, channels, subscriptions, hasMoreSubscriptions } = this.state;

		const menuOptions = [{ displayName: "Delete", onClick: this.deleteChannel }];

		return (
			<Grid container spacing={2}>
				<Grid item sm={3} md={2}>
					<Subscriptions
						subscriptions={subscriptions}
						getSubscriptions={this.getSubscriptions}
						hasMoreSubscriptions={hasMoreSubscriptions}
						addChannels={this.addChannels}
					/>
					<Sidebar
						options={channels}
						idField="_id"
						menu={menuOptions}
						loading={loadingChannels}
						noResultsMessage={"No channels"}
					/>
					<ChannelGroupDetail />
				</Grid>
			</Grid>
		);
	}
}

Youtube.propTypes = {
	history: PropTypes.object.isRequired,
};

export default withStyles(styles)(Youtube);
