const initState = {
	youtubeChannels: [],
	youtubeChannel: null,
	youtubePosts: []
}

const youtubeReducer = (state = initState, action) => {
	switch(action.type){
		case "GET_CHANNELS":
			console.log("Get youtube channels");
			return { ...state, youtubeChannels: action.channels };
		case "UPDATE_CHANNEL":
			console.log("Updated youtube channel");
			return { ...state, youtubeChannel: action.channel };
		case "GET_POSTS":
			console.log("Get youtube posts");
			return { ...state, youtubePosts: action.posts };
		default:
			return state;
	}
}

export default youtubeReducer;
