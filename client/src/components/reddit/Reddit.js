import React, { Component } from "react";
import { connect } from "react-redux";

import { getSubreddits, getPosts } from "../../store/actions/redditActions";

import Sidebar from "../.partials/Sidebar";
import Categories from "../.partials/Categories";
import Posts from "./Posts";

import "../../css/Reddit.css";

class Reddit extends Component {
  componentDidMount() {
    this.props.getSubreddits(this.props.auth.uid);
  }

  getPostsSubreddit = (subreddit) => {
    console.log(subreddit)
    this.props.getPosts(subreddit, this.props.category, this.props.auth.uid);
  }

  getPostsCategory = (category) => {
    this.props.getPosts(this.props.subreddit, category, this.props.auth.uid);
  }

  render(){
    const { subreddits, posts } = this.props;

    const categories = [
      {id: "hot", displayName: "Hot", path: "/reddit", active: true },
      {id: "new", displayName: "New", path: "/reddit", active: false },
      {id: "rising", displayName: "Rising", path: "/reddit", active: false},
      {id: "controversial", displayName: "Controversial", path: "/reddit", active: false},
      {id: "top", displayName: "Top", path: "/reddit", active: false},
    ];

    return (
      <div className="reddit">
        <div className="row">
          <div className="col-sm-3 col-md-2 col-lg-2">
            <Sidebar
              options={ subreddits }
              idField="id"
              action={ this.getPostsSubreddit }
            />
          </div>
          <div className="col-sm-9 col-md-10 col-lg-10">
            <Categories options={ categories } action={ this.getPostsCategory } />
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
