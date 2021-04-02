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
} from "@material-ui/core";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Reminders() {
	const classes = useStyles();
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const response = await getScheduledNotifications();
			if (response.status === 200) {
				console.log(response.data);
				setNotifications(response.data);
			}
		}

		fetchData();
	}, []);

	return (
		<TableContainer component={Paper}>
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell>{"Reminder"}</TableCell>
						<TableCell align="right">{"Date"}</TableCell>
						<TableCell align="right">{"Time"}</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{notifications.map(notification => (
						<TableRow key={notification.name}>
							<TableCell component="th" scope="row">
								{notification.name}
							</TableCell>
							<TableCell align="right">{notification.date}</TableCell>
							<TableCell align="right">{notification.time}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default Reminders;
