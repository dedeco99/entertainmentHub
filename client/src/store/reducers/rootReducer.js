import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase"

import authReducer from "./authReducer";
import redditReducer from "./redditReducer";
import tvSeriesReducer from "./tvSeriesReducer";

const rootReducer = combineReducers({
	auth: authReducer,
	reddit: redditReducer,
	tvSeries: tvSeriesReducer,
	firestore: firestoreReducer,
	firebase: firebaseReducer
});

export default rootReducer;
