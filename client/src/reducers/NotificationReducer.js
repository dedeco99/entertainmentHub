export const notificationReducer = (state, action) => {
	let notifications = JSON.parse(JSON.stringify(state.notifications));
	let scheduledNotifications = JSON.parse(JSON.stringify(state.scheduledNotifications || []));

	switch (action.type) {
		case "SET_NOTIFICATIONS":
			return { ...state, notifications: action.notifications, total: action.total };
		case "ADD_NOTIFICATION":
			notifications.unshift(action.notification);

			notifications = notifications.sort((a, b) => (a.topPriority <= b.topPriority ? 1 : -1));

			return { ...state, notifications, total: state.total + 1 };
		case "DELETE_NOTIFICATION":
			const notificationIds = action.notifications.map(n => n._id);
			notifications = notifications.filter(n => !notificationIds.includes(n._id));

			return { ...state, notifications, total: state.total - action.notifications.length };
		case "SET_SCHEDULED_NOTIFICATIONS":
			return { ...state, scheduledNotifications: action.scheduledNotifications };
		case "ADD_SCHEDULED_NOTIFICATION":
			scheduledNotifications.push(action.scheduledNotification);

			return { ...state, scheduledNotifications };
		case "DELETE_SCHEDULED_NOTIFICATION":
			scheduledNotifications = scheduledNotifications.filter(
				n => n._id !== action.scheduledNotification.notificationId,
			);

			return { ...state, scheduledNotifications };
		default:
			return state;
	}
};
