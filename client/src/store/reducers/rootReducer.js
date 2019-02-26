import authReducer from "./authReducer";
import redditReducer from "./redditReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
	auth: authReducer,
	reddit: redditReducer
});

export default rootReducer;
