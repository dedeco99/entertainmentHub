const initState = {
	authError: null
}

const authReducer = (state = initState, action) => {
	switch(action.type){
		case "LOGIN_OK":
			console.log("Login successful");
			return { ...state, authError: null };
		case "LOGIN_ERROR":
			console.log("Login failed");
			return { ...state, authError: "Login Failed" };
		case "LOGOUT_OK":
			console.log("Logout successful");
			return { ...state, authError: null };
		default:
			return state;
	}
}

export default authReducer;
