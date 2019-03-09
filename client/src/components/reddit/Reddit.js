import React, { Component } from "react";
import Sidebar from "./Sidebar";
import Posts from "./Posts";

class Reddit extends Component {
  state = {
    subreddits: []
  };

  componentDidMount() {
    fetch("api/reddit/subreddits")
    .then(res => res.json())
    .then(subreddits => this.setState({subreddits}),()=>console.log(this.state.subreddits));
  }

  render(){
    const {subreddits} = this.state;
    return (
      <div className="Reddit">
        <Sidebar options={subreddits} />
        <br/>
        <Posts />
      </div>
    )
  }
}

export default Reddit;
