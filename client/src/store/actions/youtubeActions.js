export const getChannels = (userId) => {
	return (dispatch, getState) => {
		fetch("api/youtube/channels?userId="+userId)
		.then(res => res.json())
		.then(channels => {
			dispatch({ type: "GET_CHANNELS", channels })
		}).catch(error => {
			console.log("GET_CHANNELS_ERROR", error.message);
		});
	}
};

export const getPosts = (channel, userId) => {
	return (dispatch, getState) => {
		fetch("api/youtube/channels/"+channel+"?userId="+userId)
		.then(res => res.json())
		.then(posts => {
			dispatch({ type: "GET_POSTS", posts })
			dispatch({ type: "UPDATE_CHANNEL", channel })
		}).catch(error => {
			console.log("GET_POSTS_ERROR", error.message);
		});
	}
};
