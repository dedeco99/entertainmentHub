import { useContext, useEffect } from "react";
import socketio from "socket.io-client";

import { NotificationContext } from "../../contexts/NotificationContext";

const SocketClient = () => {
	const { dispatch } = useContext(NotificationContext);

	useEffect(() => {
		const socket = socketio("http://entertainmenthub.ddns.net:5000", { transports: ["websocket"] });

		socket.on("connect", () => {
			let user = null;
			try {
				user = JSON.parse(localStorage.getItem("user"));
			} catch (err) {
				user = localStorage.getItem("user");
			}

			socket.emit("bind", user);
		});

		socket.on("notification", notification => {
			dispatch({ type: "ADD_NOTIFICATION", notification });
		});
	}, []);

	return null;
};

export default SocketClient;
