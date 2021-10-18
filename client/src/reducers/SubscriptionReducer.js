export const subscriptionReducer = (state, action) => {
	switch (action.type) {
		case "SET_OPEN":
			return { ...state, open: action.open };
		case "SET_IS_NOTIFICATION":
			return { ...state, isNotification: action.isNotification };
		case "SET_SUBSCRIPTION":
			return { ...state, subscription: action.subscription };
		case "SET_GROUPS":
			return { ...state, groups: action.groups };
		default:
			return state;
	}
};
