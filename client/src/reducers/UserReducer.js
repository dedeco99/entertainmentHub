export const userReducer = (state, action) => {
	let { apps } = state;

	switch (action.type) {
		case "SET_USER":
			localStorage.setItem("user", JSON.stringify(action.user));

			return action.user;
		case "SET_APPS":
			apps = action.apps;

			localStorage.setItem("user", JSON.stringify({ ...state, apps }));

			return { ...state, apps };
		case "ADD_APP":
			apps.push(action.app);

			localStorage.setItem("user", JSON.stringify({ ...state, apps }));

			return { ...state, apps };
		case "DELETE_APP":
			apps = apps.filter(a => a._id !== action.app._id);

			localStorage.setItem("user", JSON.stringify({ ...state, apps }));

			return { ...state, apps };
		default:
			return state;
	}
};
