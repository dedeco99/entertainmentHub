import React, { Component } from "react";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";

import Input from "../.partials/Input";

import { getChannels } from "../../api/channels";
import { addChannelGroup } from "../../api/channelGroups";

class ChannelGroupDetail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			channels: [],
			selectedChannels: [],
			channelGroup: "",

			openModal: false,
		};

		this.getChannels = this.getChannels.bind(this);

		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleSubmitChannelsGroup = this.handleSubmitChannelsGroup.bind(this);
		this.handleGetChannels = this.handleGetChannels.bind(this);
		this.handleChannelGroup = this.handleChannelGroup.bind(this);

		this.renderChannelsOptionLabel = this.renderChannelsOptionLabel.bind(this);
		this.renderChannelInput = this.renderChannelInput.bind(this);
		this.renderTags = this.renderTags.bind(this);
	}

	async componentDidMount() {
		await this.getChannels();
	}

	async getChannels() {
		const response = await getChannels("youtube");

		if (response.data && response.data.length) {
			this.setState({ channels: response.data });
		}
	}

	handleOpenModal() {
		this.setState({ openModal: true });
	}

	handleCloseModal() {
		this.setState({ openModal: false });
	}

	handleGetChannels(e, channels) {
		this.setState({ selectedChannels: channels.map(c => c.channelId) });
	}

	handleChannelGroup(e) {
		this.setState({ channelGroup: e.target.value });
	}

	async handleSubmitChannelsGroup() {
		const { channelGroup, selectedChannels } = this.state;

		if (channelGroup === "" || selectedChannels.length === 0) return;

		await addChannelGroup("youtube", channelGroup, selectedChannels);
	}

	renderChannelsOptionLabel(option) {
		return `${option.displayName}`;
	}

	renderChannelInput(params) {
		return <Input {...params} label="Channels" variant="outlined" fullWidth margin="normal" />;
	}

	renderTags(value, getTagProps) {
		if (!value) return [];

		return value.map((option, index) => (
			<Chip key={option._id} value={option._id} color="primary" label={option.displayName} {...getTagProps({ index })} />
		));
	}

	render() {
		const { openModal, channels } = this.state;

		return (
			<div>
				<IconButton color="primary" onClick={this.handleOpenModal}>
					<i className="icofont-ui-add" />
				</IconButton>
				<Dialog
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
					open={openModal}
					fullWidth
					maxWidth="xs"
				>
					<DialogTitle id="simple-dialog-title">{"New Channel Group"}</DialogTitle>
					<DialogContent>
						<Input
							type="text"
							label="Name"
							margin="normal"
							variant="outlined"
							fullWidth
							required
							onChange={this.handleChannelGroup}
						/>
						<Autocomplete
							id="Channel"
							multiple
							limitTags={2}
							renderTags={this.renderTags}
							onChange={this.handleGetChannels}
							options={channels || []}
							renderInput={this.renderChannelInput}
							getOptionLabel={option => option.displayName}
							fullWidth
							required
							label="Channels"
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleCloseModal} color="primary">
							{"Close"}
						</Button>
						<Button color="primary" autoFocus onClick={this.handleSubmitChannelsGroup}>
							{"Add"}
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

export default ChannelGroupDetail;
