const initState = {
	notifications: [],
};

const notificationsReducer = (state = initState, action) => {
	switch (action.type) {
		case "ADD_NOTIFICATION":
			const notifications = JSON.parse(JSON.stringify(state.notifications));
			notifications.push(action.notification);

			return { ...state, notifications };
		default:
			return state;
	}
};

export default notificationsReducer;
