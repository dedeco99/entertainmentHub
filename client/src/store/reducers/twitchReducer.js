const initState = {
	channels: [],
	streams: []
}

const twitchReducer = (state = initState, action) => {
	switch(action.type){
		case "GET_TWITCH_CHANNELS":
			console.log("Get youtube channels");
			return { ...state, channels: action.channels };
		case "GET_TWITCH_STREAMS":
			console.log("Get youtube posts");
			return { ...state, streams: action.streams };
		default:
			return state;
	}
}

export default twitchReducer;
