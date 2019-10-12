import React from "react";

import loading from "../../img/loading.gif";

const Sidebar = ({ options, idField, action }) => {
	const handleClick = (e) => {
		action(e.target.id);

		var i = 0;
		var li = document.getElementsByTagName("li");
		for (i = 0; i < li.length; i++) {
			li[i].classList.remove("active");
		}

		e.target.closest("li").classList.add("active");
	}

	const optionsList = options && options.length > 0
		? (
			options.map(option => {
				return (
					<li
						className="nav-link option"
						onClick={handleClick}
						key={option.id}
						id={option[idField]}
					>
						{option.displayName}
					</li>
				)
			})
		) : (
			<img src={loading} width="100%" alt="Loading..." />
		)

	return (
		<ul className="nav flex-column nav-pills">
			{optionsList}
		</ul>
	);
}

export default Sidebar;
