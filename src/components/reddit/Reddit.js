import React from "react";
import Categories from "./Categories";
import Posts from "./Posts";

const Reddit = () => {
  return (
    <div className="Reddit">
      <div className="container-fluid">
        <Categories />
        <br/>
        <Posts />
      </div>
    </div>
  );
}

export default Reddit;
