const initState = {
	posts: []
}

const redditReducer = (state = initState, action) => {
	let posts = state.posts;

	switch(action.type){
		case "GET_POSTS":
			posts = action.posts;
			break;
		case "ADD_POST":
			console.log("added post", action.post);
			action.post.id = Math.random();
			posts = [...state.posts,action.post];
			break;
		case "DELETE_POST":
			posts = state.posts.filter(post => {
				return action.id !== post.id
			});
			break;
		default:
			break;
	}

	return {
		...state,
		posts: posts
	}
}

export default redditReducer;
