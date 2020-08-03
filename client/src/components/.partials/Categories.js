import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeStyles, List, ListItem, ListItemText } from "@material-ui/core";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Categories({ options, selected, idField, nameField, action }) {
	const classes = useStyles();

	function handleClick(id) {
		action(id);
	}

	const optionsList = options.map(option => {
		return (
			<ListItem
				button
				selected={selected === option[idField]}
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
	selected: PropTypes.number.isRequired,
	idField: PropTypes.string.isRequired,
	nameField: PropTypes.string.isRequired,
	action: PropTypes.func.isRequired,
};

export default Categories;
