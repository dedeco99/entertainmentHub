export const actionReducer = (state, action) => {
	let actions = state.actions;

	switch (action.type) {
		case "ADD_ACTIONS":
			return { ...state, actions: [...actions, ...action.actions].sort((a, b) => (b.from - a.from ? 1 : -1)) };
		case "DELETE_ACTIONS":
			actions = actions.filter(a => a.from !== action.from);

			return { ...state, actions };
		default:
			return state;
	}
};
