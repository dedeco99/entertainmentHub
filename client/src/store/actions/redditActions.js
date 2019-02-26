export const getPosts = (subreddit, category) => {
	return (dispatch, getState) => {
		fetch("api/reddit/subreddits/"+subreddit+"/"+category)
		.then(res => res.json())
		.then(posts => dispatch({ type: "GET_POSTS", posts }));
	}
};

export const addPost = (post) => {
	return (dispatch, getState) => {
		//make async call to db
		dispatch({ type: "ADD_POST", post });
	}
};
