import React, { Component } from "react";
import { connect } from "react-redux";

import { getSubreddits, getPosts } from "../../store/actions/redditActions";

import Sidebar from "./Sidebar";
import Categories from "./Categories";
import Posts from "./Posts";

import "../../css/Reddit.css";

class Reddit extends Component {
  componentDidMount() {
    this.props.getSubreddits(this.props.auth.uid);
  }

  getPosts = (subreddit, category) => {
    this.props.getPosts(subreddit, !category ? this.props.category : category, this.props.auth.uid)
  }

  render(){
    const { subreddits, subreddit, posts } = this.props;

    return (
      <div className="reddit">
        <div className="row">
          <div className="col-sm-3 col-md-2 col-lg-2">
            <Sidebar options={ subreddits } getPosts={ this.getPosts } />
          </div>
          <div className="col-sm-9 col-md-10 col-lg-10">
            <Categories subreddit={ subreddit } getPosts={ this.getPosts } />
            <br/>
            <Posts posts={ posts } />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    subreddits: state.reddit.subreddits,
    subreddit: state.reddit.subreddit,
    category: state.reddit.category,
    posts: state.reddit.posts
  }
}

const mapDispatchToProps = (dispatch) => {
	return {
    getSubreddits: (userId) => dispatch(getSubreddits(userId)),
		getPosts: (subreddit, category, userId) => dispatch(getPosts(subreddit, category, userId))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Reddit);
