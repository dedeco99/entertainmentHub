import React, { Component } from "react";
import PropTypes from "prop-types";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";

import Input from "../.partials/Input";

import { getChannels } from "../../api/channels";
import { addChannelsGroup } from "../../api/channelGroup";


class ChannelGroups extends Component {
	constructor(props) {
		super(props);

		this.state = {
			channels: [],
			selectedChannels: [],
			channelGroup: "",
		};

		this.getChannels = this.getChannels.bind(this);

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

	async handleSubmitChannelsGroup() {
		const { channelGroup, selectedChannels } = this.state;

		if (channelGroup === "" || selectedChannels.length === 0) return;

		const response = await addChannelsGroup("youtube", channelGroup, selectedChannels);

		if (response.status < 400) {
			window.location.replace("/youtube");
		}
	}

	handleGetChannels(e, channels) {
		this.setState({ selectedChannels: channels });
	}

	handleChannelGroup(e) {
		this.setState({ channelGroup: e.target.value });
	}

	renderChannelsOptionLabel(option) {
		return `${option.displayName}`;
	}

	renderChannelInput(params) {
		return <Input {...params} label="Channel" variant="outlined" fullWidth margin="normal" />;
	}

	renderTags(value, getTagProps) {
		if (!value) return [];

		return value.map((option, index) => (
			<Chip key={option._id} value={option._id} color="primary" label={option.displayName} {...getTagProps({ index })} />
		));
	}

	render() {
		const { open, onClose } = this.props;
		const { channels } = this.state;


		return (
			<Dialog
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				open={open}
				fullWidth
				maxWidth="xs"
			>
				<DialogTitle id="simple-dialog-title">{"Add Channel Group"}</DialogTitle>
				<DialogContent>
					<Input
						type="text"
						label="Channel Group"
						margin="normal"
						variant="outlined"
						fullWidth
						required
						onChange={this.handleChannelGroup}
					/>
					<Autocomplete
						id="Channels"
						multiple
						limitTags={2}
						renderTags={this.renderTags}
						onChange={this.handleGetChannels}
						options={channels || []}
						renderInput={this.renderChannelInput}
						getOptionLabel={(option) => option.displayName}
						fullWidth
						required
						label="Channels"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="primary">
						{"Close"}
					</Button>
					<Button color="primary" autoFocus onClick={this.handleSubmitChannelsGroup}>
						{"Add"}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

ChannelGroups.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default ChannelGroups;
