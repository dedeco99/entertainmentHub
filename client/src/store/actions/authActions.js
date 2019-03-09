export const register = (user) => {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		const firebase = getFirebase();
		const firestore = getFirestore();

		console.log(user);

		firebase.auth().createUserWithEmailAndPassword(
			user.email,
			user.password
		).then((res) => {
			return firestore.collection("users").doc(res.user.uid).set({
				birthday: user.birthday
			});
		}).then(() => {
			dispatch({ type: "REGISTER_OK" });
		}).catch((error) => {
			dispatch({ type: "REGISTER_ERROR", error });
		});
	}
}

export const login = (credentials) => {
	return (dispatch, getState, { getFirebase }) => {
		const firebase = getFirebase();

		firebase.auth().signInWithEmailAndPassword(
			credentials.email,
			credentials.password
		).then(() => {
			dispatch({ type: "LOGIN_OK" })
		}).catch((error) => {
			dispatch({ type: "LOGIN_ERROR", error })
		});
	}
}

export const logout = () => {
	return (dispatch, getState, { getFirebase }) =>{
		const firebase = getFirebase();

		firebase.auth().signOut()
		.then(() => {
			dispatch({ type: "LOGOUT_OK" })
		});
	}
}
