export const getSubreddits = (userId) => {
	return (dispatch, getState) => {
		fetch("api/reddit/subreddits?userId="+userId)
		.then(res => res.json())
		.then(subreddits => {
			dispatch({ type: "GET_SUBREDDITS", subreddits })
		}).catch(error => {
			console.log("GET_SUBREDDITS_ERROR", error.message);
		});
	}
};

export const getPosts = (subreddit, category, userId) => {
	return (dispatch, getState) => {
		fetch("api/reddit/subreddits/"+subreddit+"/"+category+"?userId="+userId)
		.then(res => res.json())
		.then(posts => {
			dispatch({ type: "GET_REDDIT_POSTS", posts })
			dispatch({ type: "UPDATE_SUBREDDIT", subreddit })
			dispatch({ type: "UPDATE_REDDIT_CATEGORY", category })
		}).catch(error => {
			console.log("GET_REDDIT_POSTS_ERROR", error.message);
		});
	}
};
