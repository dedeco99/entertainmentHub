import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	MenuItem,
	FormControlLabel,
	Checkbox,
	Divider,
	Typography,
	Chip,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import Input from "./Input";

import { UserContext } from "../../contexts/UserContext";

import { getPlaylists } from "../../api/youtube";

import { translate } from "../../utils/translations";

function SubscriptionDetail({ open, subscription, editSubscription, onClose }) {
	const { user } = useContext(UserContext);
	const [title, setTitle] = useState("");
	const [notifications, setNotifications] = useState({
		active: true,
		autoAddToWatchLater: false,
		watchLaterPlaylist: user.settings.youtube && user.settings.youtube.watchLaterPlaylist,
		dontShowWithTheseWords: [],
	});
	const [playlists, setPlaylists] = useState([]);

	useEffect(() => {
		if (subscription) {
			setTitle(subscription.displayName);
			if (subscription.notifications) {
				setNotifications({
					...subscription.notifications,
					watchLaterPlaylist: subscription.notifications.watchLaterPlaylist
						? subscription.notifications.watchLaterPlaylist
						: user.settings.youtube && user.settings.youtube.watchLaterPlaylist,
				});
			}
		}
	}, [subscription]); // eslint-disable-line

	useEffect(() => {
		async function fetchData() {
			const hasYoutube = user.apps.find(app => app.platform === "youtube");

			if (hasYoutube) {
				const response = await getPlaylists();

				if (response.status === 200) {
					setPlaylists(response.data);
				}
			}
		}

		fetchData();
	}, []); // eslint-disable-line

	function handleChangeTitle(e) {
		setTitle(e.target.value);
	}

	function handleChangeWatchLaterPlaylist(e) {
		setNotifications({ ...notifications, watchLaterPlaylist: e.target.value });
	}

	function handleChangeAutoAddToWatchLater(e) {
		setNotifications({ ...notifications, autoAddToWatchLater: !notifications.autoAddToWatchLater });
	}

	function handleChangeActive(e) {
		setNotifications({ ...notifications, active: !notifications.active });
	}

	async function handleSubmit(e) {
		e.preventDefault();

		await editSubscription(subscription._id, { displayName: title, notifications });
	}

	function renderTags(value, getTagProps) {
		if (!value) return [];

		return value.map((option, index) => (
			<Chip key={option} value={option} color="primary" label={option} {...getTagProps({ index })} />
		));
	}

	const hasNotifications = ["youtube", "tv"];

	return (
		<Dialog
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			open={open}
			fullWidth
			maxWidth="xs"
		>
			<form onSubmit={handleSubmit}>
				<DialogTitle id="simple-dialog-title">{translate("editSubscription")}</DialogTitle>
				<DialogContent>
					<Input
						id="title"
						type="text"
						label={translate("title")}
						value={title}
						onChange={handleChangeTitle}
						margin="normal"
						variant="outlined"
						fullWidth
						required
					/>
					{subscription && hasNotifications.includes(subscription.platform) && (
						<>
							<Divider style={{ marginTop: 20, marginBottom: 20 }} />
							<Typography variant="h6" style={{ marginBottom: 10 }}>
								{translate("notifications")}
							</Typography>
							<FormControlLabel
								control={<Checkbox checked={notifications.active} color="primary" onChange={handleChangeActive} />}
								label={"Active"}
							/>
						</>
					)}
					{subscription && subscription.platform === "youtube" && (
						<>
							<br />
							<FormControlLabel
								control={
									<Checkbox
										checked={notifications.autoAddToWatchLater}
										color="primary"
										onChange={handleChangeAutoAddToWatchLater}
									/>
								}
								label={"Add to watch later automatically"}
							/>
							<br />
							<br />
							<Input
								label="Youtube Watch Later Playlist"
								id="watchLaterPlaylist"
								value={notifications.watchLaterPlaylist}
								onChange={handleChangeWatchLaterPlaylist}
								variant="outlined"
								select
								fullWidth
							>
								{playlists.map(p => (
									<MenuItem key={p.externalId} value={p.externalId}>
										{p.displayName}
									</MenuItem>
								))}
							</Input>
							<br />
							<br />
							<Autocomplete
								value={notifications.dontShowWithTheseWords}
								multiple
								onChange={(event, newValue) => {
									setNotifications({
										...notifications,
										dontShowWithTheseWords: newValue,
									});
								}}
								options={[]}
								freeSolo
								renderInput={params => (
									<Input {...params} label="Don't show with these words" variant="outlined" />
								)}
								renderTags={renderTags}
								fullWidth
							/>
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="primary">
						{translate("close")}
					</Button>
					<Button type="submit" color="primary" autoFocus>
						{translate("edit")}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

SubscriptionDetail.propTypes = {
	open: PropTypes.bool.isRequired,
	subscription: PropTypes.object,
	editSubscription: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default SubscriptionDetail;
