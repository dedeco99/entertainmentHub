import React from "react";

import "../../css/Youtube.css";
import play from "../../img/play.png";

const Post = ({ post }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title"><a href={ "https://youtu.be/" + post.id } target="_blank" rel="noopener noreferrer">{ post.title }</a></h5>
      </div>
      <div className="card-body">
        <div className="centerContainer">
          <img className="youtubeVideo" id={ post.id } src={ play } alt="Play" />
          <img src={ post.thumbnail } width="100%" alt="Thumbnail" />
        </div>
      </div>
      <div className="card-footer text-muted">
        <a className="btn btn-primary" data-toggle="collapse" href={ "#post" + post.id } role="button" aria-expanded="false" aria-controls={ "post" + post.id }>
          Comments
        </a>
        <div className="collapse" id={ "post" + post.id }>
          <div>
            Comments
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
