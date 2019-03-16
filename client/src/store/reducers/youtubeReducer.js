const initState = {
	channels: [],
	channel: null,
	posts: []
}

const youtubeReducer = (state = initState, action) => {
	switch(action.type){
		case "GET_YOUTUBE_CHANNELS":
			console.log("Get youtube channels");
			return { ...state, channels: action.channels };
		case "UPDATE_YOUTUBE_CHANNEL":
			console.log("Updated youtube channel", action.channel);
			return { ...state, channel: action.channel };
		case "GET_YOUTUBE_POSTS":
			console.log("Get youtube posts");
			return { ...state, posts: action.posts };
		default:
			return state;
	}
}

export default youtubeReducer;
