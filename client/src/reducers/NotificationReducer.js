export const notificationReducer = (state, action) => {
	let notifications = JSON.parse(JSON.stringify(state.notifications));

	switch (action.type) {
		case "SET_NOTIFICATIONS":
			return { ...state, notifications: action.notifications, total: action.total };
		case "ADD_NOTIFICATION":
			notifications.unshift(action.notification);

			return { ...state, notifications, total: state.total + 1 };
		case "DELETE_NOTIFICATION":
			const notificationIds = action.notifications.map(n => n._id);
			notifications = notifications.filter(n => !notificationIds.includes(n._id));

			return { ...state, notifications, total: state.total - action.notifications.length };
		default:
			return state;
	}
};
