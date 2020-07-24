import React, { Component } from "react";
import PropTypes from "prop-types";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";

import Input from "../.partials/Input";

import { YoutubeContext } from "../../contexts/YoutubeContext";

import { getChannels } from "../../api/channels";
import { addChannelGroup, editChannelGroup } from "../../api/channelGroups";

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
		this.handleUpdateChannelsGroup = this.handleUpdateChannelsGroup.bind(this);
		this.handleGetChannels = this.handleGetChannels.bind(this);
		this.handleChannelGroup = this.handleChannelGroup.bind(this);

		this.renderChannelsOptionLabel = this.renderChannelsOptionLabel.bind(this);
		this.renderChannelInput = this.renderChannelInput.bind(this);
		this.renderTags = this.renderTags.bind(this);
		this.renderEditMode = this.renderEditMode.bind(this);
	}

	async componentDidMount() {
		await this.getChannels();

		const { channels } = this.state;
		const { selectedChannelGroup } = this.props;
		const selected = selectedChannelGroup ? selectedChannelGroup.channels : [];
		const channelGroupTitle = selectedChannelGroup ? selectedChannelGroup.displayName : "";
		this.setState({
			selectedChannels: channels.filter(channel => selected.includes(channel.channelId)),
			channelGroup: channelGroupTitle,
		});
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
		this.setState({ selectedChannels: channels });
	}

	handleChannelGroup(e) {
		this.setState({ channelGroup: e.target.value });
	}

	async handleSubmitChannelsGroup() {
		const { dispatch } = this.context;
		const { channelGroup, selectedChannels } = this.state;

		if (channelGroup === "" || selectedChannels.length === 0) return;

		const response = await addChannelGroup("youtube", channelGroup, selectedChannels.map(c => c.channelId));

		if (response.status === 201) {
			dispatch({ type: "ADD_CHANNEL_GROUP", channelGroup: response.data });
			this.setState({ openModal: false });
		}
	}

	async handleUpdateChannelsGroup(channelId) {
		const { dispatch } = this.context;
		const { channelGroup, selectedChannels } = this.state;

		if (channelGroup === "" || selectedChannels.length === 0 || channelId === null) return;

		const response = await editChannelGroup(channelId, channelGroup, selectedChannels.map(c => c.channelId));

		if (response.status === 200) {
			dispatch({ type: "EDIT_CHANNEL_GROUP", channelGroup: response.data });
			this.setState({ openModal: false });
		}
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

	renderEditMode() {
		const { openEditMode } = this.props;

		if (openEditMode) {
			return (
				<MenuItem onClick={this.handleOpenModal}>
					{"Edit"}
				</MenuItem>
			);
		}

		return (
			<IconButton color="primary" onClick={this.handleOpenModal}>
				<i className="icofont-ui-add" />
			</IconButton>
		);
	}

	render() {
		const { channels, channelGroup, selectedChannels, openModal } = this.state;
		const { openEditMode, selectedChannelGroup } = this.props;
		console.log(selectedChannelGroup);

		const title = openEditMode ? "Edit Channel Group" : "New Channel Group";

		const channelId = selectedChannelGroup ? selectedChannelGroup._id : null;

		const buttonTitle = openEditMode ? "Update" : "Add";
		const onClickFunction = openEditMode ? () => this.handleUpdateChannelsGroup(channelId) : this.handleSubmitChannelsGroup;

		return (
			<div>
				{this.renderEditMode()}
				<Dialog
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
					open={openModal}
					fullWidth
					maxWidth="xs"
				>
					<DialogTitle id="simple-dialog-title">{title}</DialogTitle>
					<DialogContent>
						<Input
							type="text"
							label="Name"
							margin="normal"
							variant="outlined"
							defaultValue={channelGroup}
							fullWidth
							required
							onChange={this.handleChannelGroup}
						/>
						<Autocomplete
							id="Channel"
							multiple
							disableCloseOnSelect
							value={selectedChannels}
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
						<Button color="primary" autoFocus onClick={onClickFunction}>
							{buttonTitle}
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

ChannelGroupDetail.contextType = YoutubeContext;

ChannelGroupDetail.propTypes = {
	openEditMode: PropTypes.bool.isRequired,
	selectedChannelGroup: PropTypes.object,
};

export default ChannelGroupDetail;
