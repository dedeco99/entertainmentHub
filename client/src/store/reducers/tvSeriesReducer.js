const initState = {
	tvSeries: [],
	tvSeriesSearch: []
}

const tvSeriesReducer = (state = initState, action) => {
	switch(action.type){
		case "GET_TVSERIES_SEARCH":
			console.log("Get TV Series search");
			return { ...state, tvSeriesSearch: action.tvSeriesSearch };
		case "ADD_TVSERIES":
			console.log("Added TV Series");
			return { ...state, tvSeries: action.tvSeries };
		case "ADD_TVSERIES_ERROR":
			console.log("(Error) Added TV Series", action.error);
			return state;
		default:
			return state;
	}
}

export default tvSeriesReducer;
