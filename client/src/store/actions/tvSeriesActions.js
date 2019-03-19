export const getSearch = (search, userId) => {
	return (dispatch, getState) => {
		fetch("api/tvSeries/search/"+search.search+"?userId="+userId)
		.then(res => res.json())
		.then(tvSeriesSearch => {
			dispatch({ type: "GET_TVSERIES_SEARCH", tvSeriesSearch })
		}).catch(error => {
			console.log("GET_TVSERIES_SEARCH_ERROR", error.message);
		});
	}
};

export const addTVSeries = (tvSeries, userId) => {
	tvSeries = JSON.parse(tvSeries);

	return (dispatch, getState, { getFirebase, getFirestore }) => {
		const firestore = getFirestore();
		firestore.collection("tvSeries").add({
			seriesId: tvSeries.id,
			displayName: tvSeries.displayName,
			user: userId,
			createdAt: new Date()
		})
		.then(() => dispatch({ type: "ADD_TVSERIES", tvSeries }))
		.catch(error => dispatch({ type: "ADD_TVSERIES_ERROR", error}));
	}
};
