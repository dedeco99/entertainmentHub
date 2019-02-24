import React from 'react';
import Grid from '@material-ui/core/Grid';
import Post from "./Post";

const Posts = ({ posts , deletePost }) => {
	const postList = posts.length ? (
		posts.map(post => {
			return (
				<Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={post.id} onClick={() => {deletePost(post.id)}}>
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

export default Posts;
