import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";

import Sidebar from "../.partials/Sidebar";
import Subscriptions from "./Subscriptions";

import { getChannels, addChannels, deleteChannel } from "../../api/youtube";

import { youtube as styles } from "../../styles/Youtube";

class Youtube extends Component {
	constructor() {
		super();

		this.state = {
			channels: [],
			openModal: false,
		};

		this.addChannels = this.addChannels.bind(this);
		this.deleteChannel = this.deleteChannel.bind(this);

		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
	}

	async componentDidMount() {
		await this.getChannels();
	}

	async getChannels() {
		const response = await getChannels();

		if (response.data && response.data.length) {
			this.setState({ channels: response.data });
		}
	}

	async addChannels(channels) {
		const response = await addChannels(channels);

		if (response.status < 400) {
			this.setState(prevState => ({
				channels: [...prevState.channels, ...response.data].sort((a, b) => (
					a.displayName <= b.displayName ? -1 : 1
				)),
			}));
		}
	}

	async deleteChannel(e) {
		const { channels } = this.state;

		const response = await deleteChannel(e.target.id);

		if (response.status < 400) {
			const updatedChannels = channels.filter(s => s._id !== response.data._id);

			this.setState({ channels: updatedChannels });
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
		const { loadingChannels, channels } = this.state;

		const menuOptions = [{ displayName: "Delete", onClick: this.deleteChannel }];

		return (
			<Grid container spacing={2}>
				<Grid item sm={3} md={2}>
					<IconButton onClick={this.handleOpenModal}>
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
					channels={channels}
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
