import React, { Component } from 'react';
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import Post from "./Post";

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
				<Grid container spacing={24}>
	      	{ postList }
				</Grid>
	    </div>
	  );
	}
}

const mapStateToProps = (state) => {
  return {
    posts: state.reddit.posts
  }
}

export default connect(mapStateToProps, null)(Posts);
