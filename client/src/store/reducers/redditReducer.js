const initState = {
	subreddits: [],
	subreddit: "all",
	redditCategory: "hot",
	redditPosts: []
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
			return { ...state, redditCategory: action.category };
		case "GET_POSTS":
			console.log("Get posts");
			return { ...state, redditPosts: action.posts };
		default:
			return state;
	}
}

export default redditReducer;
