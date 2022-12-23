import React, { useContext, useState, useEffect } from "react";
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
	IconButton,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import Input from "./Input";

import { UserContext } from "../../contexts/UserContext";
import { SubscriptionContext } from "../../contexts/SubscriptionContext";
import { YoutubeContext } from "../../contexts/YoutubeContext";
import { TVContext } from "../../contexts/TVContext";

import { editSubscription } from "../../api/subscriptions";

import { translate } from "../../utils/translations";

import { widgetDetail as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function SubscriptionDetail() {
	const classes = useStyles();
	const { user } = useContext(UserContext);
	const {
		state: { open, isNotification, subscription, groups },
		dispatch: subscriptionDispatch,
	} = useContext(SubscriptionContext);
	const { state } = useContext(YoutubeContext);
	const { playlists } = state;
	const { dispatch: tvDispatch } = useContext(TVContext);
	const [title, setTitle] = useState("");
	const [group, setGroup] = useState({ name: "Ungrouped", pos: 0 });
	const [notifications, setNotifications] = useState({
		active: true,
		priority: 0,
		autoAddToWatchLater: false,
		watchLaterPlaylist: user.settings ? user.settings.youtube && user.settings.youtube.watchLaterPlaylist : null,
		rules: [],
		dontShowWithTheseWords: [],
		onlyShowWithTheseWords: [],
	});
	const [showAddNewRule, setShowAddNewRule] = useState(false);
	const [newRule, setNewRule] = useState({ if: {}, then: {} });
	const [newRuleValues, setNewRuleValues] = useState({});
	const [newRuleOptions, setNewRuleOptions] = useState({ condition: null, action: null });

	const addGroupSubject = new Subject();

	useEffect(() => {
		const subscription = addGroupSubject
			.pipe(
				debounceTime(250),
				filter(name => name),
			)
			.subscribe(name => {
				setGroup({ name, pos: groups.length });
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

	function handleChangePriority(e) {
		setNotifications({ ...notifications, priority: e.target.value });
	}

	function handleDeleteRule(id) {
		setNotifications({ ...notifications, rules: notifications.rules.filter(rule => rule._id !== id) });
	}

	function toggleShowAddNewRule() {
		setShowAddNewRule(!showAddNewRule);
	}

	function handleChangeRuleCondition(e) {
		setNewRuleOptions({ ...newRuleOptions, condition: e.target.value });

		const defaults = {
			hasTheseWords: [],
			doesntHaveTheseWords: [],
		};

		const conditionExists = e.target.value in newRule.if;

		if (!conditionExists) {
			setNewRule({ ...newRule, if: { ...newRule.if, [e.target.value]: defaults[e.target.value] } });
			setNewRuleValues({ ...newRuleValues, [e.target.value]: defaults[e.target.value] });
		}
	}

	function handleChangeRuleAction(e) {
		setNewRuleOptions({ ...newRuleOptions, action: e.target.value });

		const defaults = {
			active: notifications.active,
			priority: notifications.priority,
			autoAddToWatchLater: notifications.autoAddToWatchLater,
			watchLaterPlaylist: notifications.watchLaterPlaylist,
		};

		const actionExists = e.target.value in newRule.then;

		if (!actionExists) {
			setNewRule({ ...newRule, then: { ...newRule.then, [e.target.value]: defaults[e.target.value] } });
			setNewRuleValues({ ...newRuleValues, [e.target.value]: defaults[e.target.value] });
		}
	}

	function handleAddNewRule() {
		for (const field in newRule.if) {
			newRule.if[field] = newRuleValues[field];
		}

		for (const field in newRule.then) {
			newRule.then[field] = newRuleValues[field];
		}

		setNotifications({ ...notifications, rules: [...notifications.rules, newRule] });

		toggleShowAddNewRule();
		setNewRule({ if: {}, then: {} });
		setNewRuleValues({});
		setNewRuleOptions({ condition: null, action: null });
	}

	function handleCloseModal() {
		subscriptionDispatch({ type: "SET_OPEN", open: false });
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const response = await editSubscription(subscription._id, { displayName: title, group, notifications });

		if (response.status === 200) {
			handleCloseModal();

			if (response.data.platform === "tv") {
				tvDispatch({ type: "EDIT_SUBSCRIPTION", subscription: response.data });
			}
		}

		if (groups && !groups.map(g => g.name).includes(group.name)) groups.push(group);
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

	function renderRuleField(key, value, active, newRule) {
		if (key === "active") {
			return (
				<FormControlLabel
					key={key}
					disabled={!active}
					control={
						<Checkbox
							checked={value}
							color="primary"
							onChange={
								newRule
									? e => {
											setNewRuleValues({ ...newRuleValues, active: e.target.checked });
									  }
									: handleChangeActive
							}
						/>
					}
					label={"Active"}
				/>
			);
		} else if (key === "priority") {
			return (
				<Input
					key={key}
					disabled={!active}
					label="Priority"
					value={value}
					onChange={
						newRule
							? e => {
									setNewRuleValues({ ...newRuleValues, priority: e.target.value });
							  }
							: handleChangePriority
					}
					variant="outlined"
					select
					fullWidth
					style={{ margin: "5px 0px" }}
				>
					{[
						{ name: "High", value: 3 },
						{ name: "Medium", value: 2 },
						{ name: "Low", value: 1 },
						{ name: "None", value: 0 },
					].map(p => (
						<MenuItem key={p.value} value={p.value}>
							{p.name}
						</MenuItem>
					))}
				</Input>
			);
		} else if (key === "hasTheseWords") {
			return (
				<Autocomplete
					key={key}
					disabled={!active}
					value={value}
					onChange={(event, newValue) => {
						setNewRuleValues({ ...newRuleValues, hasTheseWords: newValue });
					}}
					multiple
					options={[]}
					freeSolo
					renderInput={params => <Input {...params} label="Has these words" variant="outlined" />}
					renderTags={renderTags}
					fullWidth
					style={{ margin: "10px 0px" }}
				/>
			);
		} else if (key === "doesntHaveTheseWords") {
			return (
				<Autocomplete
					key={key}
					disabled={!active}
					value={value}
					onChange={(event, newValue) => {
						setNewRuleValues({ ...newRuleValues, doesntHaveTheseWords: newValue });
					}}
					multiple
					options={[]}
					freeSolo
					renderInput={params => <Input {...params} label="Doesn't have these words" variant="outlined" />}
					renderTags={renderTags}
					fullWidth
					style={{ margin: "10px 0px" }}
				/>
			);
		} else if (key === "watchLaterPlaylist") {
			return (
				<Input
					key={key}
					disabled={!active}
					label="Youtube Watch Later Playlist"
					id="watchLaterPlaylist"
					value={value}
					onChange={
						newRule
							? e => {
									setNewRuleValues({ ...newRuleValues, watchLaterPlaylist: e.target.value });
							  }
							: handleChangeWatchLaterPlaylist
					}
					variant="outlined"
					select
					fullWidth
					style={{ margin: "10px 0px" }}
				>
					{playlists.map(p => (
						<MenuItem key={p.externalId} value={p.externalId}>
							{p.displayName}
						</MenuItem>
					))}
				</Input>
			);
		} else if (key === "autoAddToWatchLater") {
			return (
				<FormControlLabel
					key={key}
					disabled={!active}
					control={
						<Checkbox
							checked={value}
							color="primary"
							onChange={
								newRule
									? e => {
											setNewRuleValues({ ...newRuleValues, autoAddToWatchLater: e.target.checked });
									  }
									: handleChangeAutoAddToWatchLater
							}
						/>
					}
					label={"Add to watch later automatically"}
				/>
			);
		} else {
			return <div key={key}>{`${key}: ${value}`}</div>;
		}
	}

	const hasNotifications = ["youtube", "tv"];

	if (!user.token) return null;

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
					{!isNotification && groups && (
						<Autocomplete
							freeSolo
							value={group}
							renderTags={renderTags}
							options={groups.sort((a, b) => (a.pos > b.pos ? 1 : -1)) || []}
							onChange={handleChangeGroup}
							onInputChange={handleAddGroup}
							className={classes.autocomplete}
							getOptionLabel={renderGroupOptionLabel}
							renderInput={renderGroupInput}
							fullWidth
						/>
					)}
					{subscription && hasNotifications.includes(subscription.platform) && (
						<>
							<Divider style={{ marginTop: 20, marginBottom: 20 }} />
							<Typography variant="h6" style={{ marginBottom: 10 }}>
								{translate("notifications")}
							</Typography>
							{renderRuleField("active", notifications.active, true)}
							{renderRuleField("priority", notifications.priority, true)}
						</>
					)}
					{subscription && subscription.platform === "youtube" && (
						<>
							<br />
							<br />
							{renderRuleField("watchLaterPlaylist", notifications.watchLaterPlaylist, true)}
							{renderRuleField("autoAddToWatchLater", notifications.autoAddToWatchLater, true)}
							<br />
							<br />
							<Typography variant="subtitle1">
								<b>{"Rules"}</b>
							</Typography>
							{notifications.rules.map(rule => (
								<div
									key={rule._id}
									style={{
										backgroundColor: "#333",
										borderRadius: "3px",
										margin: "5px 0px",
										padding: "10px",
										position: "relative",
									}}
								>
									<IconButton
										edge="end"
										aria-label="delete"
										size="small"
										onClick={() => handleDeleteRule(rule._id)}
										style={{ top: "5px", right: "5px", position: "absolute" }}
									>
										<i className="icon-delete" />
									</IconButton>
									<Typography variant="body1">{"If"}</Typography>
									<div style={{ marginLeft: "10px" }}>
										{Object.entries(rule.if).map(([key, value]) => renderRuleField(key, value))}
									</div>
									<Divider style={{ marginTop: 15, marginBottom: 15 }} />
									<Typography variant="body1">{"Then"}</Typography>
									<div style={{ marginLeft: "10px" }}>
										{Object.entries(rule.then).map(([key, value]) => renderRuleField(key, value))}
									</div>
								</div>
							))}
							{showAddNewRule ? (
								<div
									style={{
										backgroundColor: "#333",
										borderRadius: "3px",
										margin: "5px 0px",
										padding: "10px",
										position: "relative",
									}}
								>
									<Typography variant="body1">{"If"}</Typography>
									<div style={{ marginLeft: "10px" }}>
										<Input
											label="Condition"
											value={newRuleOptions.condition}
											onChange={handleChangeRuleCondition}
											variant="outlined"
											select
											fullWidth
											style={{ margin: "5px 0px" }}
										>
											{[
												{ name: "Has these words", value: "hasTheseWords" },
												{ name: "Doesn't have these words", value: "doesntHaveTheseWords" },
											].map(p => (
												<MenuItem key={p.value} value={p.value}>
													{p.name}
												</MenuItem>
											))}
										</Input>
										{Object.entries(newRule.if).map(([key, value]) =>
											renderRuleField(key, newRuleValues[key], true, true),
										)}
									</div>
									<Divider style={{ marginTop: 15, marginBottom: 15 }} />
									<Typography variant="body1">{"Then"}</Typography>
									<div style={{ marginLeft: "10px" }}>
										<Input
											label="Action"
											value={newRuleOptions.action}
											onChange={handleChangeRuleAction}
											variant="outlined"
											select
											fullWidth
											style={{ margin: "5px 0px" }}
										>
											{[
												{ name: "Active", value: "active" },
												{ name: "Priority", value: "priority" },
												{ name: "Youtube Watch Later Playlist", value: "watchLaterPlaylist" },
												{ name: "Add to watch later automatically", value: "autoAddToWatchLater" },
											].map(p => (
												<MenuItem key={p.value} value={p.value}>
													{p.name}
												</MenuItem>
											))}
										</Input>
										{Object.entries(newRule.then).map(([key, value]) =>
											renderRuleField(key, newRuleValues[key], true, true),
										)}
										<div align="right">
											<Button onClick={handleAddNewRule} color="primary">
												{translate("add")}
											</Button>
										</div>
									</div>
								</div>
							) : (
								<center>
									<i className="icon-add icon-2x" onClick={toggleShowAddNewRule} />
								</center>
							)}
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseModal} color="primary">
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

export default SubscriptionDetail;
