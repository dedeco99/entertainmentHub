const initState = {
	tvSeries: [],
	series: null,
	seasons: [],
	episodes: [],
	tvSeriesSearch: []
}

const tvSeriesReducer = (state = initState, action) => {
	switch(action.type){
		case "GET_TVSERIES_SEASONS":
			console.log("Get TV Series seasons");
			if(action.tvSeries == "all"){
				return { ...state, seasons: [], episodes: action.seasons };
			}else{
				return { ...state, seasons: action.seasons, episodes: [] };
			}
		case "UPDATE_TVSERIES_SERIES":
			console.log("Updated TV Series series", action.tvSeries);
			return { ...state, series: action.tvSeries };
		case "GET_TVSERIES_EPISODES":
			console.log("Get TV Series episodes");
			return { ...state, episodes: action.episodes };
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
