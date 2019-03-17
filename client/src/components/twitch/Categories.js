import React, { Component } from "react";
import { Link } from "react-router-dom";

class Categories extends Component {
  handleClick = (e) => {
    this.props.getPosts(this.props.subreddit,e.target.id);

    var i = 0;
		var a = document.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        a[i].classList.remove("active");
    }

    e.target.closest("a").classList.add("active");
  };

  render() {
    return (
      <ul className="nav nav-pills nav-fill">
        <li className="nav-item" onClick={ this.handleClick }><Link id="hot" to="/twitch" className="nav-link active">Games</Link></li>
        <li className="nav-item" onClick={ this.props.getStreams }><Link id="new" to="/twitch" className="nav-link">Streams</Link></li>
        <li className="nav-item" onClick={ this.props.getChannels }><Link id="rising" to="/twitch" className="nav-link">Channels</Link></li>
      </ul>
    );
  }
}

export default Categories;
