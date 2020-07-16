import { useContext, useEffect } from "react";
import socketio from "socket.io-client";

import { UserContext } from "../../contexts/UserContext";
import { NotificationContext } from "../../contexts/NotificationContext";

const SocketClient = () => {
	const { user } = useContext(UserContext);
	const { dispatch } = useContext(NotificationContext);

	useEffect(() => {
		const socket = socketio("wss://entertainmenthub.ddns.net", { transports: ["websocket"] });

		socket.on("connect", () => {
			socket.emit("bind", user);
		});

		socket.on("notification", notification => {
			dispatch({ type: "ADD_NOTIFICATION", notification });
		});
	}, []);

	return null;
};

export default SocketClient;
