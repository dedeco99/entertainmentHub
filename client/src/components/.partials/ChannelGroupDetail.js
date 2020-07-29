import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";

import Input from "./Input";

import { YoutubeContext } from "../../contexts/YoutubeContext";
import { RedditContext } from "../../contexts/RedditContext";

import { addChannelGroup, editChannelGroup } from "../../api/channelGroups";
import { getSubreddits } from "../../api/reddit";

function ChannelGroupDetail({ open, channelGroup, platform, onClose }) {
	const { state, dispatch } = useContext(platform === "youtube" ? YoutubeContext : RedditContext);
	const { channels } = state;
	const [selectedChannels, setSelectedChannels] = useState([]);
	const [name, setName] = useState("");
	const [typingTimeout, setTypingTimeout] = useState(null);

	function setChannelGroupInfo() {
		if (channelGroup) {
			setName(channelGroup.displayName);
			setSelectedChannels(
				platform === "youtube"
					? channels.filter(c => channelGroup.channels.includes(c.channelId))
					: channelGroup.channels.map(c => ({
							displayName: c,
					  })),
			);
		}
	}

	useEffect(() => {
		setChannelGroupInfo();
	}, []); // eslint-disable-line

	function handleCloseModal() {
		onClose();
		setChannelGroupInfo();
	}

	function handleGetSubreddits(e, filter) {
		if (!filter) return;

		if (typingTimeout) clearTimeout(typingTimeout);

		const timeout = setTimeout(async () => {
			const response = await getSubreddits(filter);

			if (response.status === 200) {
				dispatch({ type: "SET_CHANNELS", channels: response.data });
			}
		}, 500);

		setTypingTimeout(timeout);
	}

	function handleName(e) {
		setName(e.target.value);
	}

	function handleSelectedChannels(e, selected) {
		setSelectedChannels(selected);
	}

	async function handleSubmit() {
		if (!name || !selectedChannels.length) return;

		// prettier-ignore
		const mappedChannels = platform === "youtube"
			? selectedChannels.map(c => c.channelId)
			: selectedChannels.map(c => c.displayName);

		const response = await addChannelGroup(platform, name, mappedChannels);

		if (response.status === 201) {
			dispatch({ type: "ADD_CHANNEL_GROUP", channelGroup: response.data });
			onClose();
		}
	}

	async function handleUpdate() {
		if (!channelGroup || !name || !selectedChannels.length) return;

		const mappedChannels = selectedChannels.map(c => c.channelId);

		const response = await editChannelGroup({ ...channelGroup, displayName: name, channels: mappedChannels });

		if (response.status === 200) {
			dispatch({ type: "EDIT_CHANNEL_GROUP", channelGroup: response.data });
			onClose();
		}
	}

	function renderOptionLabel(option) {
		return `${option.displayName}`;
	}

	function renderInput(params) {
		return (
			<Input
				{...params}
				label={platform === "youtube" ? "Channels" : "Subreddits"}
				variant="outlined"
				fullWidth
				margin="normal"
			/>
		);
	}

	function renderTags(value, getTagProps) {
		if (!value) return [];

		return value.map((option, index) => (
			<Chip
				key={option._id}
				value={option._id}
				color="primary"
				label={option.displayName}
				{...getTagProps({ index })}
			/>
		));
	}

	return (
		<div>
			<Dialog
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				open={open}
				fullWidth
				maxWidth="xs"
			>
				<div>
					<DialogTitle id="simple-dialog-title">
						{channelGroup ? "Edit Channel Group" : "New Channel Group"}
					</DialogTitle>
					<DialogContent>
						<Input
							type="text"
							label="Name"
							margin="normal"
							variant="outlined"
							defaultValue={name}
							fullWidth
							required
							onChange={handleName}
						/>
						<Autocomplete
							id="Channel"
							multiple
							disableCloseOnSelect
							value={selectedChannels}
							limitTags={2}
							renderTags={renderTags}
							onInputChange={platform === "reddit" && handleGetSubreddits}
							onChange={handleSelectedChannels}
							options={channels || []}
							renderInput={renderInput}
							getOptionLabel={renderOptionLabel}
							fullWidth
							required
							label="Channels"
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseModal} color="primary">
							{"Close"}
						</Button>
						<Button color="primary" autoFocus onClick={channelGroup ? handleUpdate : handleSubmit}>
							{channelGroup ? "Update" : "Add"}
						</Button>
					</DialogActions>
				</div>
			</Dialog>
		</div>
	);
}

ChannelGroupDetail.propTypes = {
	open: PropTypes.bool.isRequired,
	channelGroup: PropTypes.object,
	platform: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default ChannelGroupDetail;
