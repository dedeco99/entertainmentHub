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
