import notificationsReducer from "./notificationsReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
	notifications: notificationsReducer,
});

export default rootReducer;
