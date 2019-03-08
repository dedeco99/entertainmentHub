export const addTVSeries = (tvSeries) => {
	return (dispatch, getState, { getFirebase, getFirestore }) => {
		const firestore = getFirestore();
		firestore.collection("tvseries").add({
			...tvSeries,
			user: 1,
			createdAt: new Date()
		})
		.then(() => dispatch({ type: "ADD_TVSERIES", tvSeries }))
		.catch(error => dispatch({ type: "ADD_TVSERIES_ERROR", error}));
	}
};
