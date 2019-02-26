import React, { Component } from 'react';
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import Categories from "./Categories";
import Post from "./Post";
import AddPost from "./AddPost";

class Posts extends Component {
	render(){
		const { posts } = this.props;
    console.log(posts);
		const postList = posts.length>0 ? (
			posts.map(post => {
				return (
					<Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={post.created}>
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
        <Categories />
        <br/>
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
    posts: state.reddit.posts
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deletePost: (id) => { dispatch({ type: "DELETE_POST", id: id }) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
