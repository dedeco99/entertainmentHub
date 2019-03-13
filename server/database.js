const admin = require("firebase-admin");
const firebaseSecret = require("./firebaseSecret");

exports.initialize = () => {
	admin.initializeApp({
	  credential: admin.credential.cert(firebaseSecret)
	});

	exports.firestore = admin.firestore();
}

exports.firestore = null;
