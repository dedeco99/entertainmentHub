export const notificationReducer = (state, action) => {
	let notifications = JSON.parse(JSON.stringify(state.notifications));

	switch (action.type) {
		case "ADD_NOTIFICATION":
			if (Array.isArray(action.notification)) {
				notifications = action.notification;

				return { ...state, notifications };
			}

			notifications.unshift(action.notification);

			return { ...state, notifications, total: state.total + 1 };
		case "DELETE_NOTIFICATION":
			notifications = notifications.filter(n => n._id !== action.notification._id);

			return { ...state, notifications, total: state.total - 1 };
		case "UPDATE_TOTAL":
			return { ...state, total: action.total };
		default:
			return state;
	}
};
