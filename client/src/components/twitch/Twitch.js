import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";

import Sidebar from "../.partials/Sidebar";
import Subscriptions from "../.partials/Subscriptions";

import { getFollows } from "../../api/twitch";
import { getChannels, addChannels, deleteChannel } from "../../api/channels";

class Twitch extends Component {
	constructor() {
		super();

		this.state = {
			channels: [],
			follows: [],
			hasMoreFollows: false,
			page: 0,
			after: null,
		};

		this.getFollows = this.getFollows.bind(this);
		this.addChannels = this.addChannels.bind(this);
		this.deleteChannel = this.deleteChannel.bind(this);
	}

	async componentDidMount() {
		await this.getChannels();
		await this.getFollows();
	}

	async getFollows() {
		const { channels, follows, page, after } = this.state;

		const response = await getFollows(after);

		if (response.data && response.data.length) {
			const newFollows = page === 0 ? response.data : follows.concat(response.data);

			this.setState({
				follows: newFollows.filter(s => !channels.map(c => c.channelId).includes(s.channelId)),
				page: page + 1,
				after: response.data[0].after,
				hasMoreFollows: !(response.data.length < 20),
			});
		}
	}

	async getChannels() {
		const response = await getChannels("twitch");

		if (response.data && response.data.length) {
			this.setState({ channels: response.data });
		}
	}

	async addChannels(channels) {
		const response = await addChannels("twitch", channels);

		if (response.status < 400) {
			this.setState(prevState => ({
				channels: [...prevState.channels, ...response.data].sort((a, b) => (
					a.displayName.toLowerCase() <= b.displayName.toLowerCase() ? -1 : 1
				)),
				follows: prevState.follows.filter(s => (
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

			this.setState({ channels: updatedChannels, page: 0, after: null }, this.getFollows);
		}
	}

	render() {
		const { loadingChannels, channels, follows, hasMoreFollows } = this.state;

		const menuOptions = [{ displayName: "Delete", onClick: this.deleteChannel }];

		return (
			<Grid container spacing={2}>
				<Grid item sm={3} md={2}>
					<Subscriptions
						subscriptions={follows}
						getSubscriptions={this.getFollows}
						hasMoreSubscriptions={hasMoreFollows}
						addChannels={this.addChannels}
					/>
					<Sidebar
						options={channels}
						idField="_id"
						menu={menuOptions}
						loading={loadingChannels}
						noResultsMessage={"No channels"}
					/>
				</Grid>
				<Grid item sm={9} md={10} lg={10} />
			</Grid>
		);
	}
}

export default Twitch;
