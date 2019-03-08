import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { reduxFirestore, getFirestore } from "redux-firestore";
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";

import rootReducer from "./store/reducers/rootReducer"
import * as serviceWorker from './serviceWorker';
import firebaseConfig from "./config/firebaseConfig"

import App from './components/App';

import './index.css';

const store = createStore(rootReducer,
	compose(
		applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
		reactReduxFirebase(firebaseConfig, {attachAuthIsReady: true}),
		reduxFirestore(firebaseConfig)
	)
);

store.firebaseAuthIsReady.then(()=>{
	ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

serviceWorker.unregister();
