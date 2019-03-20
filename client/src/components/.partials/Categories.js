import React from "react";
import { Link } from "react-router-dom";

const Categories = ({ options, action }) => {
  const handleClick = (e) => {
    action(e.target.id);

    var i = 0;
		var a = document.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        a[i].classList.remove("active");
    }

    e.target.closest("a").classList.add("active");
  };

  const optionsList = options.map(option => {
    return (option.active ?
      <li className="nav-item" onClick={ handleClick } key={ option.id }>
        <Link id={ option.id } to={ option.path } className="nav-link active">
          { option.displayName }
        </Link>
      </li>
    :
      <li className="nav-item" onClick={ handleClick } key={ option.id }>
        <Link id={ option.id } to={ option.path } className="nav-link">
          { option.displayName }
        </Link>
      </li>
    )
  });

  return (
    <ul className="nav nav-pills nav-fill">
      { optionsList }
    </ul>
  );
}

export default Categories;
