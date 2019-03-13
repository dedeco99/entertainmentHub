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
    console.log("category: ",this.props.subreddit)
    return (
      <ul className="nav nav-pills nav-fill">
        <li className="nav-item" onClick={ this.handleClick }><Link id="hot" to="/reddit" className="nav-link active">Hot</Link></li>
        <li className="nav-item" onClick={ this.handleClick }><Link id="new" to="/reddit" className="nav-link">New</Link></li>
        <li className="nav-item" onClick={ this.handleClick }><Link id="rising" to="/reddit" className="nav-link">Rising</Link></li>
        <li className="nav-item" onClick={ this.handleClick }><Link id="controversial" to="/reddit" className="nav-link">Controversial</Link></li>
        <li className="nav-item" onClick={ this.handleClick }><Link id="top" to="/reddit" className="nav-link">Top</Link></li>
      </ul>
    );
  }
}

export default Categories;
