import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";

import Input from "../.partials/Input";

import { YoutubeContext } from "../../contexts/YoutubeContext";

import { addChannelGroup, editChannelGroup } from "../../api/channelGroups";

function ChannelGroupDetail({ open, channelGroup, onClose }) {
	const { state, dispatch } = useContext(YoutubeContext);
	const { channels } = state;
	const [selectedChannels, setSelectedChannels] = useState([]);
	const [name, setName] = useState("");

	useEffect(() => {
		if (channelGroup) {
			setName(channelGroup.displayName);
			setSelectedChannels(channels.filter(c => channelGroup.channels.includes(c.channelId)));
		}
	}, []); // eslint-disable-line

	function handleCloseModal() {
		onClose();

		if (channelGroup) {
			setName(channelGroup.displayName);
			setSelectedChannels(channels.filter(c => channelGroup.channels.includes(c.channelId)));
		}
	}

	function handleName(e) {
		setName(e.target.value);
	}

	function handleSelectedChannels(e, selected) {
		setSelectedChannels(selected);
	}

	async function handleSubmit(e) {
		e.preventDefault();

		if (!name || !selectedChannels.length) return;

		const mappedChannels = selectedChannels.map(c => c.channelId);

		const response = await addChannelGroup("youtube", name, mappedChannels);

		if (response.status === 201) {
			dispatch({ type: "ADD_CHANNEL_GROUP", channelGroup: response.data });
			onClose();
		}
	}

	async function handleUpdate(e) {
		e.preventDefault();

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
		return <Input {...params} label="Channels" variant="outlined" fullWidth margin="normal" />;
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
					<form onSubmit={channelGroup ? handleUpdate : handleSubmit}>
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
							<Button type="submit" color="primary" autoFocus>
								{channelGroup ? "Update" : "Add"}
							</Button>
						</DialogActions>
					</form>
				</div>
			</Dialog>
		</div>
	);
}

ChannelGroupDetail.propTypes = {
	open: PropTypes.bool.isRequired,
	channelGroup: PropTypes.object,
	onClose: PropTypes.func.isRequired,
};

export default ChannelGroupDetail;
