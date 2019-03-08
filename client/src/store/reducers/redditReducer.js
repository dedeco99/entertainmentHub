const initState = {
	posts: []
}

const redditReducer = (state = initState, action) => {
	let posts = state.posts;

	if(action.type === "GET_POSTS"){
			posts = action.posts;
	}

	return {
		...state,
		posts: posts
	}
}

export default redditReducer;
