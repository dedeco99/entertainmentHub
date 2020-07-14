export const userReducer = (state, action) => {
	switch (action.type) {
		case "SET_USER":
			localStorage.setItem("user", JSON.stringify(action.user));

			return action.user;
		default:
			return state;
	}
};
