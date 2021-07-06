import React from "react";
import PropTypes from "prop-types";

import { makeStyles, List, ListItem, ListItemText, Chip, Badge } from "@material-ui/core";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Categories({ options, selected, idField, nameField, countField, action }) {
	const classes = useStyles();

	function getField(path, obj) {
		return path.split(".").reduce(function (prev, curr) {
			return prev ? prev[curr] : null;
		}, obj);
	}

	function handleClick(id) {
		action(id);
	}

	const optionsList = options.map(option => {
		const count = getField(countField, option);

		return (
			<ListItem
				button
				selected={selected === option[idField]}
				onClick={() => handleClick(option[idField])}
				key={option[idField]}
				id={option[idField]}
				className={classes.center}
				style={{ minWidth: "125px" }}
			>
				<ListItemText primary={option[nameField]} />
				{countField && <Badge color="secondary" badgeContent={count} style={{ right: "15px" }} />}
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
	countField: PropTypes.string.isRequired,
	action: PropTypes.func.isRequired,
};

export default Categories;
