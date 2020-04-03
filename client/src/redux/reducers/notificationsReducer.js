const initState = {
	notifications: [],
};

const notificationsReducer = (state = initState, action) => {
	let notifications = JSON.parse(JSON.stringify(state.notifications));

	switch (action.type) {
		case "ADD_NOTIFICATION":
			if (Array.isArray(action.notification)) {
				notifications = action.notification;
			} else {
				notifications.push(action.notification);
			}

			return { ...state, notifications };
		case "DELETE_NOTIFICATION":
			notifications = notifications.filter(n => n._id !== action.notification._id);

			console.log(notifications);

			return { ...state, notifications };
		default:
			return state;
	}
};

export default notificationsReducer;
