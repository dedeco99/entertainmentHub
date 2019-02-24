const initState = {
	posts: [
		{ id:1, title: "Gotem", body:"https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673-960x960.png", url:"https://reddit.com", upvotes:10, downvotes:5 },
		{ id:2, title: "yap", body:"content", url:"https:/reddit.com", upvotes:14, downvotes:1 },
		{ id:3, title: "nope", body:"content nope", url:"https:/reddit.com", upvotes:15, downvotes:2 }
	]
}

const redditReducer = (state = initState, action) => {
	if(action.type === "DELETE_POST"){
		let posts = state.posts.filter(post => {
			return action.id !== post.id
		});

		return {
			...state,
			posts: posts
		}
	}

	return state;
}

export default redditReducer;
