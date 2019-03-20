import React from "react";
import { Link } from "react-router-dom";

const Seasons = ({ seasons }) => {
	console.log(seasons)
  const handleClick = (e) => {
    //this.props.getPosts(this.props.subreddit,e.target.id);

    var i = 0;
		var a = document.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        a[i].classList.remove("active");
    }

    e.target.closest("a").classList.add("active");
  }

	const seasonsList = seasons && seasons.length > 0 ? (
		seasons.map(season => {
			return (
				<li className="nav-item" onClick={ handleClick } key={ season.season }><Link id={ season.id } to="/tvSeries" className="nav-link">{ season.season }</Link></li>
			)
		})
	) : (
		<div></div>
	);

  return (
    <ul className="nav nav-pills nav-fill">
      { seasonsList }
    </ul>
  );
}

export default Seasons;
