var fs = require("fs");
const admin = require("firebase-admin");
var firebaseSecret = null;

exports.initialize = () => {
	if (fs.existsSync("./server/firebaseSecret.json")) {
    firebaseSecret = require("./firebaseSecret.json");

		admin.initializeApp({
			credential: admin.credential.cert(firebaseSecret)
		});

		exports.firestore = admin.firestore();
  }else{
		var json = {
			type: process.env.firebaseSecretType,
			project_id: process.env.firebaseSecretProjectId,
			private_key_id: process.env.firebaseSecretPrivateKeyId,
			private_key: process.env.firebaseSecretPrivateKey,
			client_email: process.env.firebaseSecretClientEmail,
			client_id: process.env.firebaseSecretClientId,
			auth_uri: process.env.firebaseSecretAuthUri,
			token_uri: process.env.firebaseSecretTokenUri,
			auth_provider_x509_cert_url: process.env.firebaseSecretAuthProvider,
			client_x509_cert_url: process.env.firebaseSecretClientCertUrl
		}

		fs.writeFile("./server/firebaseSecret.json", JSON.stringify(json), "utf8", (err) => {
	    if(err) console.log(err);

	    firebaseSecret = require("./firebaseSecret.json");

			admin.initializeApp({
			  credential: admin.credential.cert(firebaseSecret)
			});

			exports.firestore = admin.firestore();
		});
	}
}

exports.firestore = null;
