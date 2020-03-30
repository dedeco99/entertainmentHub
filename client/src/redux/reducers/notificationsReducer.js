const initState = {
	notifications: [],
};

const notificationsReducer = (state = initState, action) => {
	switch (action.type) {
		case "ADD_NOTIFICATION":
			let notifications = JSON.parse(JSON.stringify(state.notifications));
			if (Array.isArray(action.notification)) {
				notifications = action.notification;
			} else {
				notifications.push(action.notification);
			}

			return { ...state, notifications };
		default:
			return state;
	}
};

export default notificationsReducer;
