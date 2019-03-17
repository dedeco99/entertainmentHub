export const getGames = (userId) => {
	return (dispatch, getState) => {
		fetch("api/twitch/games?userId="+userId)
		.then(res => res.json())
		.then(games => {
			dispatch({ type: "GET_TWITCH_GAMES", games })
		}).catch(error => {
			console.log("GET_TWITCH_GAMES_ERROR", error.message);
		});
	}
};

export const getStreamsForGame = (game, userId) => {
	return (dispatch, getState) => {
		fetch("api/twitch/games/"+game+"?userId="+userId)
		.then(res => res.json())
		.then(streams => {
			dispatch({ type: "GET_TWITCH_STREAMS_GAME", streams })
		}).catch(error => {
			console.log("GET_TWITCH_STREAMS_GAME_ERROR", error.message);
		});
	}
};

export const getStreams = (userId) => {
	return (dispatch, getState) => {
		fetch("api/twitch/streams/?userId="+userId)
		.then(res => res.json())
		.then(streams => {
			dispatch({ type: "GET_TWITCH_STREAMS", streams })
		}).catch(error => {
			console.log("GET_TWITCH_STREAMS_ERROR", error.message);
		});
	}
};

export const getChannels = (userId) => {
	return (dispatch, getState) => {
		fetch("api/twitch/channels?userId="+userId)
		.then(res => res.json())
		.then(channels => {
			dispatch({ type: "GET_TWITCH_CHANNELS", channels })
		}).catch(error => {
			console.log("GET_TWITCH_CHANNELS_ERROR", error.message);
		});
	}
};
