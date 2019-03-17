import React, { Component } from "react";
import { Link } from "react-router-dom";

class Categories extends Component {
  handleClick = (e) => {
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
        <li
          className="nav-item"
          onClick={ (e) => { this.handleClick(e); this.props.getGames() }}
        >
          <Link to="/twitch" className="nav-link">Games</Link>
        </li>
        <li
          className="nav-item"
          onClick={ (e) => { this.handleClick(e); this.props.getStreams() }}
        >
          <Link to="/twitch" className="nav-link active">Streams</Link>
        </li>
        <li
          className="nav-item"
          onClick={ (e) => { this.handleClick(e); this.props.getChannels() }}
        >
          <Link to="/twitch" className="nav-link">Channels</Link>
        </li>
      </ul>
    );
  }
}

export default Categories;
