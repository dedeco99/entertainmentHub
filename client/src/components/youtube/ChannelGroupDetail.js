import React, { useContext, useState, useEffect } from "react";
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

function ChannelGroupDetail({ channelGroup }) {
	const { dispatch } = useContext(YoutubeContext);
	const [channels, setChannels] = useState([]);
	const [selectedChannels, setSelectedChannels] = useState([]);
	const [name, setName] = useState("");
	const [open, setOpen] = useState(false);

	useEffect(() => {
		async function fetchData() {
			const response = await getChannels("youtube");

			if (response.data && response.data.length) {
				setChannels(response.data);

				if (channelGroup) {
					setName(channelGroup.displayName);
					setSelectedChannels(response.data.filter(c => channelGroup.channels.includes(c.channelId)));
				}
			}
		}

		fetchData();
	}, []); // eslint-disable-line

	function handleOpenModal() {
		setOpen(true);
	}

	function handleCloseModal() {
		setOpen(false);

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

	async function handleSubmit() {
		if (!name || !selectedChannels.length) return;

		const response = await addChannelGroup("youtube", name, selectedChannels.map(c => c.channelId));

		if (response.status === 201) {
			dispatch({ type: "ADD_CHANNEL_GROUP", channelGroup: response.data });
			setOpen(false);
		}
	}

	async function handleUpdate() {
		if (!channelGroup || !name || !selectedChannels.length) return;

		const response = await editChannelGroup(channelGroup._id, name, selectedChannels.map(c => c.channelId));

		if (response.status === 200) {
			dispatch({ type: "EDIT_CHANNEL_GROUP", channelGroup: response.data });
			setOpen(false);
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
			<Chip key={option._id} value={option._id} color="primary" label={option.displayName} {...getTagProps({ index })} />
		));
	}

	function renderEditMode() {
		if (channelGroup) {
			return (
				<MenuItem onClick={handleOpenModal}>
					{"Edit"}
				</MenuItem>
			);
		}

		return (
			<IconButton color="primary" onClick={handleOpenModal}>
				<i className="icofont-ui-add" />
			</IconButton>
		);
	}

	return (
		<div>
			{renderEditMode()}
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
	channelGroup: PropTypes.object,
};

export default ChannelGroupDetail;
