import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";

import authReducer from "./authReducer";
import redditReducer from "./redditReducer";
import tvSeriesReducer from "./tvSeriesReducer";

const rootReducer = combineReducers({
	auth: authReducer,
	reddit: redditReducer,
	tvSeries: tvSeriesReducer,
	firestore: firestoreReducer
});

export default rootReducer;
