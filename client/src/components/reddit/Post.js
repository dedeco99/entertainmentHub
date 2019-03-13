import React, { Component } from "react";

import PostContent from "./PostContent";

class Post extends Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render(){
    const {classes, post} = this.props;

    return (
      <div className="card">
        <div className="card-header">
        </div>
        <div className="card-body">
          <h5 className="card-title"><a href={ post.permalink } target="_blank" rel="noopener noreferrer">{ post.title }</a></h5>
          <p className="card-text">
            { post.upvotes } | { post.downvotes } | { post.comments } | { post.crossposts }
          </p>
          <PostContent post={post} classes={classes} />
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
}

export default Post;
