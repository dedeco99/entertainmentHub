import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

var config = {
  apiKey: "AIzaSyBhx2Igl86bIRfHhxevI3m5FbmPL2u9F4g",
  authDomain: "entertainmenthub-f33f4.firebaseapp.com",
  databaseURL: "https://entertainmenthub-f33f4.firebaseio.com",
  projectId: "entertainmenthub-f33f4",
  storageBucket: "entertainmenthub-f33f4.appspot.com",
  messagingSenderId: "769835198677"
};

firebase.initializeApp(config);
firebase.firestore();

export default firebase;
