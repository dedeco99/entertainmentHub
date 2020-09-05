export const twitchReducer = (state, action) => {
	let { follows, subscriptions } = state;

	switch (action.type) {
		case "SET_FOLLOWS":
			if (action.filter === "mine") {
				follows = action.follows.filter(f => !subscriptions.map(s => s.externalId).includes(f.externalId));
			} else {
				follows = action.follows;
			}

			return { ...state, follows };
		case "ADD_FOLLOW":
			follows.push(action.follow);

			return { ...state, follows };
		case "DELETE_FOLLOW":
			follows = follows.filter(f => f._id !== action.follow._id);

			return { ...state, follows };
		case "SET_SUBSCRIPTIONS":
			follows = follows.filter(f => subscriptions.map(s => s.externalId).includes(f.externalId));

			action.subscriptions.sort((a, b) => (a.online === b.online ? -1 : 1));
			action.subscriptions.sort((a, b) => {
				if (!a.viewers && !b.viewers) return 0;
				return a.viewers < b.viewers ? 1 : -1;
			});

			return { ...state, follows, subscriptions: action.subscriptions };
		case "ADD_SUBSCRIPTION":
			subscriptions = [...subscriptions, ...action.subscription].sort((a, b) =>
				a.displayName.toLowerCase() <= b.displayName.toLowerCase() ? -1 : 1,
			);

			follows = follows.filter(f => !subscriptions.map(s => s.externalId).includes(f.externalId));

			return { ...state, follows, subscriptions };
		case "EDIT_SUBSCRIPTION":
			subscriptions = [
				...subscriptions.filter(s => s._id !== action.subscription._id),
				action.subscription,
			].sort((a, b) => (a.displayName.toLowerCase() <= b.displayName.toLowerCase() ? -1 : 1));

			return { ...state, subscriptions };
		case "DELETE_SUBSCRIPTION":
			subscriptions = subscriptions.filter(s => s._id !== action.subscription._id);

			follows = [...follows, action.subscription].sort((a, b) =>
				a.displayName.toLowerCase() <= b.displayName.toLowerCase() ? -1 : 1,
			);

			return { ...state, follows, subscriptions };
		default:
			return state;
	}
};
