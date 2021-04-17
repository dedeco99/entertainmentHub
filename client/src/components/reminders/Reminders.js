import React, { useEffect, useState } from "react";
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

import { formatDate } from "../../utils/utils";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Reminders() {
	const classes = useStyles();
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const response = await getScheduledNotifications();
			if (response.status === 200) {
				setNotifications(response.data);
			}
		}

		fetchData();
	}, []);

	async function handleDeleteNotification(id) {
		const response = await deleteScheduledNotification(id);
		if (response.status === 200) {
			setNotifications(notifications.filter(n => n._id !== id));
		}
	}

	return (
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
					{notifications.map(notification => (
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
	);
}

export default Reminders;
