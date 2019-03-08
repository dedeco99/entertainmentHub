import React from 'react';
import Typography from '@material-ui/core/Typography';

const PostContent = ({classes, post}) => {
	var checkContent = (post) => {
		var imgTypes=["jpg","jpeg","png","gif"];
		var src = null;

		if(imgTypes.indexOf(post.url.substr(post.url.lastIndexOf(".")+1))!==-1){
			return <img src={post.url} width="100%" alt="Content"/>
		}else if(post.domain === "gfycat.com"){
			src = "https://gfycat.com/ifr/"+post.url.substr(post.url.lastIndexOf("/")+1)+"?autoplay=0&hd=1";
			return <iframe title={post.created} src={src} allowFullScreen frameBorder="0" width="100%" height={post.videoHeight} />
		}else if(post.domain === "i.imgur.com" && post.url.substr(post.url.lastIndexOf(".")+1)==="gifv"){
			src = post.url.slice(0,-4)+"mp4";
			return <video src={src} controls width="100%" />
		}else if(post.domain === "v.redd.it"){
			return <video src={post.redditVideo} controls width="100%" height="100%" />
		}else if(post.text){
			src = htmlEscape(post.text);
			return <div className="container" dangerouslySetInnerHTML={{__html: src}}/>
		}else{
			return <Typography component="p">
				<a href={post.url} target="_blank" rel="noopener noreferrer">{post.url}</a>
			</Typography>
		}
	}

	function htmlEscape(str) {
    return String(str)
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");
	}

	const content = checkContent(post);

  return (
    <div className="PostContent">
			<div align="center">
				{content}
			</div>
    </div>
  );
}

export default PostContent;
