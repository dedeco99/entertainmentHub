export const getChannels = (userId) => {
	return (dispatch, getState) => {
		fetch("api/youtube/channels?userId="+userId)
		.then(res => res.json())
		.then(channels => {
			dispatch({ type: "GET_YOUTUBE_CHANNELS", channels })
		}).catch(error => {
			console.log("GET_YOUTUBE_CHANNELS_ERROR", error.message);
		});
	}
};

export const getPosts = (channel, userId) => {
	return (dispatch, getState) => {
		fetch("api/youtube/channels/"+channel+"?userId="+userId)
		.then(res => res.json())
		.then(posts => {
			dispatch({ type: "GET_YOUTUBE_POSTS", posts })
			dispatch({ type: "UPDATE_YOUTUBE_CHANNEL", channel })
		}).catch(error => {
			console.log("GET_YOUTUBE_POSTS_ERROR", error.message);
		});
	}
};
