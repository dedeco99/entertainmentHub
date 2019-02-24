import React, { Component } from 'react';
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import Post from "./Post";
import AddPost from "./AddPost";

class Posts extends Component {
	/*state = {
    posts: [],
    posts2: [
      { id:1, title: "Gotem", content:"https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673-960x960.png", url:"https://reddit.com", upvotes:10, downvotes:5 },
      { id:2, title: "yap", content:"content", url:"https:/reddit.com", upvotes:14, downvotes:1 },
      { id:3, title: "nope", content:"content nope", url:"https:/reddit.com", upvotes:15, downvotes:2 }
    ]
  }

  componentDidMount(){
    axios.get("https://jsonplaceholder.typicode.com/posts")
    .then(res => {
      this.setState({ posts: res.data.slice(0, 10) })
    });
  }

  addPost = (post) => {
    post.id = Math.random();
    let posts = [...this.state.posts,post];
    this.setState({ posts });
	}*/

  deletePost = (id) => {
    this.props.deletePost(id);
  }

	render(){
		const { posts } = this.props;
		const postList = posts.length ? (
			posts.map(post => {
				return (
					<Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={post.id} onClick={() => {this.deletePost(post.id)}}>
							<Post post={ post }/>
					</Grid>
				)
			})
		) : (
			<Grid item xs={12}>
				<div align="center">No posts</div>
			</Grid>
		)

	  return (
	    <div className="Posts">
				<Grid container spacing={24}>
	      	{ postList }
				</Grid>
				<br/>
        <AddPost addPost={this.addPost} />
	    </div>
	  );
	}
}

const mapStateToProps = (state) => {
  return {
    posts: state.posts
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deletePost: (id) => { dispatch({ type: "DELETE_POST", id: id }) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
