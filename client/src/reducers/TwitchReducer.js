export const twitchReducer = (state, action) => {
	let { subscriptions, channels } = state;

	switch (action.type) {
		case "SET_SUBSCRIPTIONS":
			subscriptions = action.subscriptions.filter(s => (
				!channels.map(c => c.channelId).includes(s.channelId)
			));

			return { ...state, subscriptions };
		case "ADD_SUBSCRIPTION":
			subscriptions.push(action.subscription);

			return { ...state, subscriptions };
		case "DELETE_SUBSCRIPTION":
			subscriptions = subscriptions.filter(s => s._id !== action.subscription._id);

			return { ...state, subscriptions };
		case "SET_CHANNELS":
			subscriptions = subscriptions.filter(s => (
				channels.map(c => c.channelId).includes(s.channelId)
			));

			return { ...state, subscriptions, channels: action.channels };
		case "ADD_CHANNEL":
			channels = [...channels, ...action.channel].sort((a, b) => (
				a.displayName.toLowerCase() <= b.displayName.toLowerCase() ? -1 : 1
			));

			subscriptions = subscriptions.filter(s => (
				!channels.map(c => c.channelId).includes(s.channelId)
			));

			return { ...state, subscriptions, channels };
		case "DELETE_CHANNEL":
			channels = channels.filter(c => c._id !== action.channel._id);

			subscriptions = [...subscriptions, action.channel].sort((a, b) => (
				a.displayName.toLowerCase() <= b.displayName.toLowerCase() ? -1 : 1
			));

			return { ...state, subscriptions, channels };
		default:
			return state;
	}
};
