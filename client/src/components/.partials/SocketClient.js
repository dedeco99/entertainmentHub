import { useContext, useEffect } from "react";
import socketio from "socket.io-client";

import { UserContext } from "../../contexts/UserContext";
import { NotificationContext } from "../../contexts/NotificationContext";

function SocketClient() {
	const { user } = useContext(UserContext);
	const { dispatch } = useContext(NotificationContext);

	useEffect(() => {
		const socket = socketio("wss://entertainmenthub.ddns.net", { transports: ["websocket"] });

		socket.on("connect", () => {
			socket.emit("bind", user);
		});

		socket.on("notification", notification => {
			dispatch({ type: "ADD_NOTIFICATION", notification });
			
			if(Notification.permission === "granted"){
				renderBrowserNotifications(notification);
			}
		});
	}, []);

	function renderBrowserNotifications(showNotification){
		switch (showNotification.type) {
			case "youtube":
				return new Notification(showNotification.info.displayName, { 
					body: showNotification.info.videoTitle, 
					icon: showNotification.info.thumbnail 
				});
			case "tv":
				return new Notification(showNotification.info.displayName, { 
					body: "Season " + showNotification.info.season + " Episode " + showNotification.info.number,
					icon: showNotification.info.thumbnail 
				});
		}
	}

	return null;
}

export default SocketClient;
