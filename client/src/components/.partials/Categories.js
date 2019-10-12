import React from "react";

const Categories = ({ options, idField, nameField, action }) => {
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
			<li className="nav-item" onClick={handleClick} key={option[idField]}>
				<a id={option[idField]} className="nav-link active">
					{option[nameField]}
				</a>
			</li>
			:
			<li className="nav-item" onClick={handleClick} key={option[idField]}>
				<a id={option[idField]} className="nav-link">
					{option[nameField]}
				</a>
			</li>
		)
	});

	return (
		<ul className="nav nav-pills nav-fill">
			{optionsList}
		</ul>
	);
}

export default Categories;
