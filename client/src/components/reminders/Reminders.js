import React, { useEffect, useContext, useState } from "react";
import { getScheduledNotifications, deleteScheduledNotification } from "../../api/scheduledNotifications";

import {
	makeStyles,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
} from "@material-ui/core";

import ScheduledNotificationDetail from "../reminders/ScheduledNotificationDetail";

import { NotificationContext } from "../../contexts/NotificationContext";
import { ActionContext } from "../../contexts/ActionContext";

import { formatDate } from "../../utils/utils";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Reminders() {
	const classes = useStyles();
	const { state, dispatch } = useContext(NotificationContext);
	const { scheduledNotifications } = state;
	const { dispatch: actionDispatch } = useContext(ActionContext);
	const [openReminderDetail, setOpenReminderDetail] = useState(false);

	function handleOpenReminderDetail() {
		setOpenReminderDetail(true);
	}

	function handleReminderDetailClose() {
		setOpenReminderDetail(false);
	}

	useEffect(() => {
		const actions = [
			{
				from: "reminders",
				name: "Create Reminder",
				icon: <i className="icon-add" />,
				handleClick: handleOpenReminderDetail,
			},
		];

		async function fetchData() {
			actionDispatch({ type: "ADD_ACTIONS", actions });

			const response = await getScheduledNotifications();
			if (response.status === 200) {
				dispatch({ type: "SET_SCHEDULED_NOTIFICATIONS", scheduledNotifications: response.data });
			}
		}

		fetchData();

		return () => actionDispatch({ type: "DELETE_ACTIONS", from: "reminders" });
	}, []);

	async function handleDeleteNotification(id) {
		const response = await deleteScheduledNotification(id);
		if (response.status === 200) {
			dispatch({ type: "DELETE_SCHEDULED_NOTIFICATION", scheduledNotification: response.data });
		}
	}

	return (
		<div>
			<TableContainer component={Paper}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<TableCell>{"Reminder"}</TableCell>
							<TableCell align="center">{"When"}</TableCell>
							<TableCell align="right">{"Delete"}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{scheduledNotifications.map(notification => (
							<TableRow key={notification._id}>
								<TableCell>{notification.info.reminder}</TableCell>
								<TableCell align="center">{formatDate(notification.dateToSend, "DD-MM-YYYY HH:mm")}</TableCell>
								<TableCell align="right">
									<IconButton onClick={() => handleDeleteNotification(notification._id)}>
										<i className="icon-delete" />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<ScheduledNotificationDetail open={openReminderDetail} onClose={handleReminderDetailClose} />
		</div>
	);
}

export default Reminders;
