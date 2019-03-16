import React from "react";

import PostContent from "./PostContent";

const Post = ({ post }) => {
  const htmlEscape = (str) => {
    return String(str)
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title"><a href={ post.permalink } target="_blank" rel="noopener noreferrer">{ htmlEscape(post.title) }</a></h5>
      </div>
      <div className="card-body">
        <p className="card-text">
          { post.upvotes } | { post.downvotes } | { post.comments } | { post.crossposts }
        </p>
        <PostContent post={ post } />
      </div>
      <div className="card-footer text-muted">
        <a className="btn btn-primary" data-toggle="collapse" href={ "#post"+post.id } role="button" aria-expanded="false" aria-controls={ "post"+post.id }>
          Expand
        </a>
        <div className="collapse" id={ "post"+post.id }>
          <div>
            Comments
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
