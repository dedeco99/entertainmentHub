const initState = {
	tvSeries: [
		{id: "1", title: "The Blacklist"},
		{id: "2", title: "Mr. Robot"},
		{id: "3", title: "Westworld"},
	]
}

const tvSeriesReducer = (state = initState, action) => {
	switch(action.type){
		case "ADD_TVSERIES":
			console.log("Added TV Series", action.tvSeries);
			return state;
		case "ADD_TVSERIES_ERROR":
			console.log("(Error) Added TV Series", action.error);
			return state;
		default:
			return state;
	}
}

export default tvSeriesReducer;
