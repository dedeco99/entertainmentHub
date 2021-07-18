import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Subject } from "rxjs";
import { debounceTime, filter } from "rxjs/operators";

import {
	makeStyles,
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

import { widgetDetail as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function SubscriptionDetail({ open, subscription, subscriptionGroups, editSubscription, onClose }) {
	const classes = useStyles();
	const { user } = useContext(UserContext);
	const [title, setTitle] = useState("");
	const [group, setGroup] = useState({ name: "Ungrouped", pos: 0 });
	const [notifications, setNotifications] = useState({
		active: true,
		autoAddToWatchLater: false,
		watchLaterPlaylist: user.settings.youtube && user.settings.youtube.watchLaterPlaylist,
		dontShowWithTheseWords: [],
		onlyShowWithTheseWords: [],
	});
	const [playlists, setPlaylists] = useState([]);

	const addGroupSubject = new Subject();

	useEffect(() => {
		const subscription = addGroupSubject
			.pipe(
				debounceTime(250),
				filter(name => name),
			)
			.subscribe(name => {
				subscriptionGroups.push({ name });

				setGroup({ name });
			});
		return () => subscription.unsubscribe();
	});

	useEffect(() => {
		if (subscription) {
			setTitle(subscription.displayName);
			if (subscription.group) setGroup(subscription.group);
			if (subscription.notifications) {
				setNotifications({
					...subscription.notifications,
					watchLaterPlaylist: subscription.notifications.watchLaterPlaylist
						? subscription.notifications.watchLaterPlaylist
						: user.settings.youtube && user.settings.youtube.watchLaterPlaylist,
				});
			}
		}
	}, [subscription]);

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
	}, []);

	function handleChangeTitle(e) {
		setTitle(e.target.value);
	}

	function handleChangeGroup(e, value) {
		if (value) setGroup(value);
	}

	function handleAddGroup(e, name) {
		addGroupSubject.next(name);
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

		await editSubscription(subscription._id, { displayName: title, group, notifications });
	}

	function renderTags(value, getTagProps) {
		if (!value) return [];

		return value.map((option, index) => (
			<Chip key={option} value={option} color="primary" label={option} {...getTagProps({ index })} />
		));
	}

	function renderGroupOptionLabel(option) {
		return option.name || option;
	}

	function renderGroupInput(params) {
		return <Input {...params} label="Subscriptions Group" variant="outlined" fullWidth margin="normal" />;
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
					<Autocomplete
						freeSolo
						value={group}
						renderTags={renderTags}
						options={subscriptionGroups || []}
						onChange={handleChangeGroup}
						onInputChange={handleAddGroup}
						className={classes.autocomplete}
						getOptionLabel={renderGroupOptionLabel}
						renderInput={renderGroupInput}
						fullWidth
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
							<br />
							<Autocomplete
								value={notifications.onlyShowWithTheseWords}
								multiple
								onChange={(event, newValue) => {
									setNotifications({
										...notifications,
										onlyShowWithTheseWords: newValue,
									});
								}}
								options={[]}
								freeSolo
								renderInput={params => <Input {...params} label="Only show with these words" variant="outlined" />}
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
	subscriptionGroups: PropTypes.array,
	editSubscription: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default SubscriptionDetail;
