const initState = {
	subreddits: [],
	subreddit: "all",
	category: "hot",
	posts: []
}

const redditReducer = (state = initState, action) => {
	switch(action.type){
		case "GET_SUBREDDITS":
			console.log("Get subreddits");
			return { ...state, subreddits: action.subreddits };
		case "UPDATE_SUBREDDIT":
			console.log("Updated subreddit");
			return { ...state, subreddit: action.subreddit };
		case "UPDATE_CATEGORY":
			console.log("Updated category");
			return { ...state, category: action.category };
		case "GET_POSTS":
			console.log("Get posts");
			return { ...state, posts: action.posts };
		default:
			return state;
	}
}

export default redditReducer;
