import React, { Component } from "react";

import Post from "./Post";

class Posts extends Component {
	render(){
		const { posts } = this.props;

		const postList = posts.length>0 ? (
			posts.map(post => {
				return (
					<div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3" key={post.id}>
							<Post post={ post }/>
					</div>
				)
			})
		) : (
			<div className="col-12">
				<div align="center">No posts</div>
			</div>
		)

	  return (
	    <div className="Posts">
				<div className="row">
	      	{ postList }
				</div>
	    </div>
	  );
	}
}

export default Posts;
