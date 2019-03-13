import React, { Component } from "react";

import loading from "../../img/loading.gif";

class Sidebar extends Component {
  handleClick = (e) => {
    this.props.getPosts(e.target.id);

		var i = 0;
		var li = document.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        li[i].classList.remove("active");
    }

    e.target.closest("li").classList.add("active");
	}

  render() {
    const { options } = this.props;

		const optionsList = options.length>0 ? (
			options.map(option => {
				return (
						<li
              className="nav-link option"
              onClick={ this.handleClick }
              key={ option.id }
              id={ option.id }
            >
              { option.displayName }
            </li>
				)
			})
		) : (
			<img src={ loading } width="100%" alt="Loading..."/>
		)

    return (
      <ul className="nav flex-column nav-pills">
			   { optionsList }
      </ul>
    );
  }
}

export default Sidebar;
