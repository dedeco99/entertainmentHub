import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem } from "@material-ui/core";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DayjsUtils from "@date-io/dayjs";

import Input from "../.partials/Input";

import { NotificationContext } from "../../contexts/NotificationContext";

import { addScheduledNotification, editScheduledNotification } from "../../api/scheduledNotifications";

import { translate } from "../../utils/translations";

function ScheduledNotificationDetail({ open, scheduledNotification, onClose }) {
	const { dispatch } = useContext(NotificationContext);
	const [type, setType] = useState("notifications");
	const [dateToSend, setDateToSend] = useState(null);
	const [info, setInfo] = useState({});

	const submitSubject = new Subject();

	useEffect(() => {
		const subscription = submitSubject.pipe(distinctUntilChanged((a, b) => a === b)).subscribe(async () => {
			if (scheduledNotification) {
				const response = await editScheduledNotification({ ...scheduledNotification, info });

				if (response.status === 200) {
					dispatch({ type: "EDIT_SCHEDULED_NOTIFICATION", scheduledNotification: response.data });
					onClose();
					setInfo({});
				}
			} else {
				const response = await addScheduledNotification({
					dateToSend,
					type,
					info,
				});

				if (response.status === 201) {
					dispatch({ type: "ADD_SCHEDULED_NOTIFICATION", scheduledNotification: response.data });
					onClose();
					setInfo({});
				}
			}
		});
		return () => subscription.unsubscribe();
	});

	useEffect(() => {
		if (scheduledNotification) {
			setType(scheduledNotification.type);
			setInfo(scheduledNotification.info);
		} else {
			setType("reminder");
			setInfo({});
		}
	}, [scheduledNotification]); // eslint-disable-line

	function handleChange(e) {
		if (e.target.id && e.target.id.includes("info")) {
			setInfo({ ...info, [e.target.id.replace("info.", "")]: e.target.value });
		} else {
			setType(e.target.value);
		}
	}

	function handleSubmit(e) {
		e.preventDefault();

		submitSubject.next(info);
	}

	function renderFields() {
		switch (type) {
			case "reminder":
				return (
					<div>
						<Input
							id="info.reminder"
							type="text"
							label="Reminder"
							value={info.reminder || ""}
							onChange={handleChange}
							margin="normal"
							variant="outlined"
							fullWidth
							required
						/>
						<MuiPickersUtilsProvider utils={DayjsUtils}>
							<DateTimePicker
								label="Date and Time"
								value={dateToSend}
								onChange={setDateToSend}
								ampm={false}
								disablePast
								margin="normal"
								inputVariant="outlined"
								fullWidth
								required
								style={{ border: "1px solid white", borderRadius: "3px" }}
							/>
						</MuiPickersUtilsProvider>
					</div>
				);
			default:
				return null;
		}
	}

	function renderTypes() {
		const types = [{ value: "reminder", displayName: "Reminder" }];

		return (
			<Input
				label="Type"
				id="type"
				value={type}
				onChange={handleChange}
				variant="outlined"
				select
				fullWidth
				required
				disabled={Boolean(scheduledNotification)}
			>
				{types.map(t => (
					<MenuItem key={t.value} value={t.value}>
						{t.displayName}
					</MenuItem>
				))}
			</Input>
		);
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
				<DialogTitle id="simple-dialog-title">
					{scheduledNotification ? "Edit Notification" : "New Notification"}
				</DialogTitle>
				<DialogContent>
					{renderTypes()}
					{renderFields()}
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="primary">
						{translate("close")}
					</Button>
					<Button type="submit" color="primary" autoFocus>
						{scheduledNotification ? "Update" : "Add"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

ScheduledNotificationDetail.propTypes = {
	open: PropTypes.bool.isRequired,
	scheduledNotification: PropTypes.object,
	onClose: PropTypes.func.isRequired,
};

export default ScheduledNotificationDetail;
