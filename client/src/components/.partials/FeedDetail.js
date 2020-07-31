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

import { translate } from "../../utils/translations";

import { addFeed, editFeed } from "../../api/feeds";
import { getSubreddits } from "../../api/reddit";

function FeedDetail({ open, feed, platform, onClose }) {
	const { state, dispatch } = useContext(platform === "youtube" ? YoutubeContext : RedditContext);
	const { channels } = state;
	const [selectedChannels, setSelectedChannels] = useState([]);
	const [name, setName] = useState("");
	const [typingTimeout, setTypingTimeout] = useState(null);

	function setFeedInfo() {
		if (feed) {
			setName(feed.displayName);
			setSelectedChannels(
				platform === "youtube"
					? channels.filter(c => feed.channels.includes(c.channelId))
					: feed.channels.map(c => ({
							displayName: c,
					  })),
			);
		}
	}

	useEffect(() => {
		setFeedInfo();
	}, []); // eslint-disable-line

	function handleCloseModal() {
		onClose();
		setFeedInfo();
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

	async function handleSubmit(e) {
		e.preventDefault();

		if (!name || !selectedChannels.length) return;

		// prettier-ignore
		const mappedChannels = platform === "youtube"
			? selectedChannels.map(c => c.channelId)
			: selectedChannels.map(c => c.displayName);

		const response = await addFeed(platform, name, mappedChannels);

		if (response.status === 201) {
			dispatch({ type: "ADD_FEED", feed: response.data });
			onClose();
		}
	}

	async function handleUpdate(e) {
		e.preventDefault();

		if (!feed || !name || !selectedChannels.length) return;

		const mappedChannels = selectedChannels.map(c => c.channelId);

		const response = await editFeed({ ...feed, displayName: name, channels: mappedChannels });

		if (response.status === 200) {
			dispatch({ type: "EDIT_FEED", feed: response.data });
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
				label={platform === "youtube" ? translate("channels") : "Subreddits"}
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

	function renderDialogTitle() {
		const loadYoutubeOrReddit = platform === "youtube"
			? feed ? translate("editChannelGroup") : translate("newChannelGroup")
			: feed ? translate("editReddit") : translate("newReddit")

		return loadYoutubeOrReddit;
	}

	return (
		<Dialog
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			open={open}
			fullWidth
			maxWidth="xs"
		>
			<form onSubmit={feed ? handleUpdate : handleSubmit}>
				<DialogTitle 
					id="simple-dialog-title"
				>
					{renderDialogTitle()}
				</DialogTitle>
				<DialogContent>
					<Input
						type="text"
						label={translate("name")}
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
						onInputChange={platform === "reddit" ? handleGetSubreddits : null}
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
						{translate("close")}
					</Button>
					<Button type="submit" color="primary" autoFocus>
						{feed ? translate("update") : translate("add")}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

FeedDetail.propTypes = {
	open: PropTypes.bool.isRequired,
	feed: PropTypes.object,
	platform: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default FeedDetail;
