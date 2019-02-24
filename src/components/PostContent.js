import React from 'react';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const PostContent = ({classes, post}) => {
	var checkContent = (post) => {
		if(post.body.includes("http")){
			return <CardMedia
				className={classes.media}
				image={post.body}
				title="Content"
			/>
		}else{
			return <CardContent>
				<Typography component="p">
					{post.body}
				</Typography>
			</CardContent>
		}
	}

	const content = checkContent(post);

  return (
    <div className="PostContent">
			{ content }
    </div>
  );
}

export default PostContent;
