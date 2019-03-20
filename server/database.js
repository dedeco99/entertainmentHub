const admin = require("firebase-admin");

exports.initialize = () => {
	admin.initializeApp({
		credential: admin.credential.cert({
			type: process.env.firebaseType,
			project_id: process.env.firebaseSecretProjectId,
			private_key_id: process.env.firebaseSecretPrivateKeyId,
			private_key: process.env.firebaseSecretPrivateKey.replace(/\\n/g, '\n'),
			client_email: process.env.firebaseSecretClientEmail,
			client_id: process.env.firebaseSecretClientId,
			auth_uri: process.env.firebaseSecretAuthUri,
			token_ri: process.env.firebaseSecretTokenUri,
			auth_provider_x509_cert_url: process.env.firebaseSecretAuthProvider,
			client_x509_cert_url: process.env.firebaseSecretClientCert
		})
	});

	exports.firestore = admin.firestore();
}

exports.firestore = null;
