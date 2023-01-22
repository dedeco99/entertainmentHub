export const tvReducer = (state, action) => {
	const { series, subscriptions, groups } = state;

	switch (action.type) {
		case "SET_SERIES":
			for (const s of action.series) {
				series[s.externalId] = s;
			}

			return { ...state, series };
		case "EDIT_SERIES":
			series[action.series.externalId] = action.series;

			return { ...state, series };
		case "SET_SUBSCRIPTIONS":
			return { ...state, subscriptions: action.subscriptions };
		case "EDIT_SUBSCRIPTION":
			const subscription = subscriptions.find(s => s._id === action.subscription._id);

			let groupHasChanged = false;
			if (subscription) {
				const oldGroup = groups.find(g => g._id === subscription.group.name);
				const currentGroup = groups.find(g => g._id === action.subscription.group.name);

				if (oldGroup) oldGroup.total--;
				if (currentGroup) currentGroup.total++;

				groupHasChanged = oldGroup.name !== currentGroup.name;

				subscription.displayName = action.subscription.displayName;
				subscription.group = action.subscription.group;
				subscription.notifications = action.subscription.notifications;
			}

			return {
				...state,
				subscriptions: groupHasChanged
					? subscriptions.filter(s => s._id !== action.subscription._id)
					: subscriptions,
			};
		case "EDIT_WATCH_NUMBERS":
			series[action.subscription.externalId].numToWatch = action.numToWatch;
			series[action.subscription.externalId].numWatched = action.numWatched;

			return { ...state, series };
		case "DELETE_SUBSCRIPTION":
			return { ...state, subscriptions: subscriptions.filter(s => s._id !== action.subscription._id), groups };
		case "SET_GROUPS":
			return { ...state, groups: action.groups };
		case "EDIT_GROUP_TOTAL":
			const group = groups.find(g => g._id === action.subscription.group.name);

			if (group) group.total += action.increment;

			return { ...state, groups };
		default:
			return state;
	}
};
