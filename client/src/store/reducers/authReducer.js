const initState = {
	authError: null
}

const authReducer = (state = initState, action) => {
	switch(action.type){
		case "REGISTER_OK":
			console.log("Register successful");
			return { ...state, authError: null };
		case "REGISTER_ERROR":
			console.log("Register failed");
			return { ...state, authError: action.error.message };
		case "LOGIN_OK":
			console.log("Login successful");
			return { ...state, authError: null };
		case "LOGIN_ERROR":
			console.log("Login failed");
			return { ...state, authError: action.error.message };
		case "LOGOUT_OK":
			console.log("Logout successful");
			return { ...state, authError: null };
		default:
			return state;
	}
}

export default authReducer;
