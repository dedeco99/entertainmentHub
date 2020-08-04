export const tvReducer = (state, action) => {
	let { follows, subscriptions } = state;

	switch (action.type) {
		case "SET_FOLLOWS":
			follows = action.follows.filter(f => !subscriptions.map(s => s.externalId).includes(f.externalId));

			return { ...state, follows };
		case "SET_SUBSCRIPTIONS":
			follows = follows.filter(f => subscriptions.map(s => s.externalId).includes(f.externalId));

			return { ...state, follows, subscriptions: action.subscriptions };
		case "ADD_SUBSCRIPTION":
			subscriptions = [...subscriptions, ...action.subscription].sort((a, b) =>
				a.displayName.toLowerCase() <= b.displayName.toLowerCase() ? -1 : 1,
			);

			return { ...state, subscriptions };
		case "EDIT_SUBSCRIPTION":
			subscriptions = [
				...subscriptions.filter(s => s._id !== action.subscription._id),
				action.subscription,
			].sort((a, b) => (a.displayName.toLowerCase() <= b.displayName.toLowerCase() ? -1 : 1));

			return { ...state, subscriptions };
		case "DELETE_SUBSCRIPTION":
			subscriptions = subscriptions.filter(s => s._id !== action.subscription._id);

			return { ...state, subscriptions };
		default:
			return state;
	}
};
