export const userReducer = (state, action) => {
	switch (action.type) {
		case "SET_USER":
			localStorage.setItem("user", JSON.stringify(action.user));

			return action.user;
		case "SET_APPS":
			const user = { ...state, apps: action.apps };

			localStorage.setItem("user", JSON.stringify(user));

			return user;
		default:
			return state;
	}
};
