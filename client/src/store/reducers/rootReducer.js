import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase"

import authReducer from "./authReducer";
import redditReducer from "./redditReducer";
import youtubeReducer from "./youtubeReducer";
import tvSeriesReducer from "./tvSeriesReducer";

const rootReducer = combineReducers({
	auth: authReducer,
	reddit: redditReducer,
	youtube: youtubeReducer,
	tvSeries: tvSeriesReducer,
	firestore: firestoreReducer,
	firebase: firebaseReducer
});

export default rootReducer;
