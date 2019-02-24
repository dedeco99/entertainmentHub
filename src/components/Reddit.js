import React, { Component } from "react";
import axios from "axios";
import Categories from "./Categories";
import Posts from "./Posts";
import AddPost from "./AddPost";

class Reddit extends Component {
  state = {
    posts: [],
    posts2: [
      { id:1, title: "Gotem", content:"https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673-960x960.png", url:"https://reddit.com", upvotes:10, downvotes:5 },
      { id:2, title: "yap", content:"content", url:"https:/reddit.com", upvotes:14, downvotes:1 },
      { id:3, title: "nope", content:"content nope", url:"https:/reddit.com", upvotes:15, downvotes:2 }
    ]
  }

  componentDidMount(){
    axios.get("https://jsonplaceholder.typicode.com/posts")
    .then(res => {
      this.setState({ posts: res.data.slice(0, 10) })
    });
  }

  addPost = (post) => {
    post.id = Math.random();
    let posts = [...this.state.posts,post];
    this.setState({ posts });
	}

  deletePost = (id) => {
    const posts = this.state.posts.filter(post => {
      return post.id !== id
    });
    this.setState({ posts });
  }

  render() {
    return (
      <div className="Reddit">
        <div className="container-fluid">
          <Categories/>
          <br/>
          <Posts posts={this.state.posts} deletePost={this.deletePost}/>
          <br/>
          <AddPost addPost={this.addPost} />
        </div>
      </div>
    );
  }
}

export default Reddit;
