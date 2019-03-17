const initState = {
	games: [],
	streamsForGame: [],
	streams: [],
	channels: []
}

const twitchReducer = (state = initState, action) => {
	switch(action.type){
		case "GET_TWITCH_GAMES":
			console.log("Get twitch games");
			return { ...state, games: action.games };
		case "GET_TWITCH_STREAMS_GAME":
			console.log("Get twitch streams for game");
			return { ...state, streamsForGame: action.streams };
		case "GET_TWITCH_STREAMS":
			console.log("Get twitch streams");
			return { ...state, streams: action.streams };
		case "GET_TWITCH_CHANNELS":
			console.log("Get twitch channels");
			return { ...state, channels: action.channels };
		default:
			return state;
	}
}

export default twitchReducer;
