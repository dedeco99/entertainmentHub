import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import Input from "./Input";

import { YoutubeContext } from "../../contexts/YoutubeContext";
import { RedditContext } from "../../contexts/RedditContext";

import { addFeed, editFeed } from "../../api/feeds";

import { translate } from "../../utils/translations";

function FeedDetail({ open, feed, platform, onClose }) {
	const { state, dispatch } = useContext(platform === "youtube" ? YoutubeContext : RedditContext);
	const { subscriptions } = state;
	const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
	const [name, setName] = useState("");

	const submitSubject = new Subject();

	useEffect(() => {
		const subscription = submitSubject
			.pipe(
				distinctUntilChanged((a, b) => {
					console.log(a, b);
					return a.name === b.name && a.selectedSubscriptions === b.selectedSubscriptions;
				}),
			)
			.subscribe(async () => {
				if (feed) {
					const mappedSubscriptions = selectedSubscriptions.map(s => s.externalId);

					const response = await editFeed({ ...feed, displayName: name, subscriptions: mappedSubscriptions });

					if (response.status === 200) {
						dispatch({ type: "EDIT_FEED", feed: response.data });
						onClose();
					}
				} else {
					const mappedSubscriptions = selectedSubscriptions.map(s => s.externalId);

					const response = await addFeed(platform, name, mappedSubscriptions);

					if (response.status === 201) {
						dispatch({ type: "ADD_FEED", feed: response.data });
						onClose();
					}
				}
			});

		return () => subscription.unsubscribe();
	});

	function setFeedInfo() {
		if (feed) {
			setName(feed.displayName);
			setSelectedSubscriptions(subscriptions.filter(s => feed.subscriptions.includes(s.externalId)));
		}
	}

	useEffect(() => {
		setFeedInfo();
	}, []); // eslint-disable-line

	function handleCloseModal() {
		onClose();
		setFeedInfo();
	}

	function handleName(e) {
		setName(e.target.value);
	}

	function handleSelectedSubscriptions(e, selected) {
		setSelectedSubscriptions(selected);
	}

	async function handleSubmit(e) {
		e.preventDefault();

		submitSubject.next({ name, selectedSubscriptions });
	}

	function renderOptionLabel(option) {
		return `${option.displayName}`;
	}

	function renderInput(params) {
		return <Input {...params} label={"Subscriptions"} variant="outlined" fullWidth margin="normal" />;
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
		<Dialog
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			open={open}
			fullWidth
			maxWidth="xs"
		>
			<form onSubmit={handleSubmit}>
				<DialogTitle id="simple-dialog-title">{feed ? translate("editFeed") : translate("newFeed")}</DialogTitle>
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
						id="Subscriptions"
						multiple
						disableCloseOnSelect
						value={selectedSubscriptions}
						limitTags={2}
						renderTags={renderTags}
						onChange={handleSelectedSubscriptions}
						options={subscriptions || []}
						renderInput={renderInput}
						getOptionLabel={renderOptionLabel}
						fullWidth
						required
						label="Subscriptions"
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
