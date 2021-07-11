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
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";

import ScheduledNotificationDetail from "../reminders/ScheduledNotificationDetail";

import { NotificationContext } from "../../contexts/NotificationContext";

import { formatDate } from "../../utils/utils";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Reminders() {
	const classes = useStyles();
	const { state, dispatch } = useContext(NotificationContext);
	const { scheduledNotifications } = state;
	const [openOptions, setOpenOptions] = useState(false);
	const [openReminderDetail, setOpenReminderDetail] = useState(false);

	useEffect(() => {
		async function fetchData() {
			const response = await getScheduledNotifications();
			if (response.status === 200) {
				dispatch({ type: "SET_SCHEDULED_NOTIFICATIONS", scheduledNotifications: response.data });
			}
		}

		fetchData();
	}, []);

	function handleOpenOptions() {
		setOpenOptions(true);
	}

	function handleCloseOptions() {
		setOpenOptions(false);
	}

	function handleOpenReminderDetail() {
		setOpenReminderDetail(true);
	}

	function handleReminderDetailClose() {
		setOpenReminderDetail(false);
	}

	async function handleDeleteNotification(id) {
		const response = await deleteScheduledNotification(id);
		if (response.status === 200) {
			dispatch({ type: "DELETE_SCHEDULED_NOTIFICATION", scheduledNotification: response.data });
		}
	}

	const actions = [
		{ name: "Create Reminder", icon: <i className="icon-add" />, handleClick: handleOpenReminderDetail },
	];

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
			<SpeedDial
				ariaLabel="Options"
				icon={<i className="icon-add" />}
				onClose={handleCloseOptions}
				onOpen={handleOpenOptions}
				open={openOptions}
				className={classes.speedDial}
				FabProps={{ size: "small" }}
			>
				{actions.map(action => (
					<SpeedDialAction
						key={action.name}
						icon={action.icon}
						tooltipTitle={action.name}
						onClick={action.handleClick}
					/>
				))}
			</SpeedDial>
		</div>
	);
}

export default Reminders;
