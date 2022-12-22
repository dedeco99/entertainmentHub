import { useContext, useEffect } from "react";
import socketio from "socket.io-client";

import { UserContext } from "../../contexts/UserContext";
import { NotificationContext } from "../../contexts/NotificationContext";
import { TVContext } from "../../contexts/TVContext";

import { formatNotification } from "../../utils/utils";

function SocketClient() {
	const { user } = useContext(UserContext);
	const { dispatch } = useContext(NotificationContext);
	const { dispatch: tvDispatch } = useContext(TVContext);

	useEffect(() => {
		const socket = socketio(process.env.REACT_APP_SOCKET_URL, { transports: ["websocket"] });

		socket.on("connect", () => {
			socket.emit("bind", user);
		});

		socket.on("notification", notification => {
			dispatch({ type: "ADD_NOTIFICATION", notification });

			if (notification.type === "reminder") {
				dispatch({ type: "DELETE_SCHEDULED_NOTIFICATION", scheduledNotification: notification });
			}

			if (Notification.permission === "granted") {
				const { thumbnail, title, subtitle } = formatNotification(notification);

				return new Notification(title, { body: subtitle, icon: thumbnail });
			}
		});

		socket.on("setSubscriptions", subscriptions => {
			tvDispatch({ type: "SET_SUBSCRIPTIONS", subscriptions });
		});
	}, []);

	return null;
}

export default SocketClient;
