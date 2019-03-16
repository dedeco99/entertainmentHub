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
			console.log("Updated subreddit", action.subreddit);
			return { ...state, subreddit: action.subreddit };
		case "UPDATE_REDDIT_CATEGORY":
			console.log("Updated reddit category", action.category);
			return { ...state, category: action.category };
		case "GET_REDDIT_POSTS":
			console.log("Get reddit posts");
			return { ...state, posts: action.posts };
		default:
			return state;
	}
}

export default redditReducer;
