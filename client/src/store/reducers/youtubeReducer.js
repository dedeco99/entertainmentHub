const initState = {
	channels: [],
	channel: null,
	posts: []
}

const youtubeReducer = (state = initState, action) => {
	switch(action.type){
		case "GET_CHANNELS":
			console.log("Get channels");
			return { ...state, channels: action.channels };
		case "UPDATE_CHANNEL":
			console.log("Updated channel");
			return { ...state, channel: action.channel };
		case "GET_POSTS":
			console.log("Get posts");
			return { ...state, posts: action.posts };
		default:
			return state;
	}
}

export default youtubeReducer;
