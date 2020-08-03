import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles, List, ListItem, ListItemText } from "@material-ui/core";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Categories({ options, initialSelected, idField, nameField, action }) {
	const classes = useStyles();
	const [selectedMenu, setSelectedMenu] = useState(null);

	function handleClick(id) {
		action(id);

		setSelectedMenu(id);
	}

	const optionsList = options.map(option => {
		return (
			<ListItem
				button
				selected={(selectedMenu || initialSelected) === option[idField]}
				onClick={() => handleClick(option[idField])}
				key={option[idField]}
				id={option[idField]}
				className={classes.center}
			>
				<ListItemText primary={option[nameField]} />
			</ListItem>
		);
	});

	return <List className={`${classes.listMenu} ${classes.horizontal}`}>{optionsList}</List>;
}

Categories.propTypes = {
	options: PropTypes.array.isRequired,
	initialSelected: PropTypes.number.isRequired,
	idField: PropTypes.string.isRequired,
	nameField: PropTypes.string.isRequired,
	action: PropTypes.func.isRequired,
	initialSelected: PropTypes.number.isRequired,
};

export default Categories;
