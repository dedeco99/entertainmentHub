import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import styles from "../../styles/General";

class Categories extends Component {
	constructor() {
		super();
		this.state = {
			selectedMenu: null,
		};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(id) {
		this.props.action(id);

		this.setState({ selectedMenu: id });
	};

	render() {
		const { classes, options, idField, nameField, initialSelected } = this.props;
		const { selectedMenu } = this.state;

		const optionsList = options.map(option => {
			return (
				<ListItem
					button
					selected={(selectedMenu || initialSelected) === option[idField]}
					onClick={() => this.handleClick(option[idField])}
					key={option[idField]}
					id={option[idField]}
					className={classes.center}
				>
					<ListItemText primary={option[nameField]} />
				</ListItem >
			)
		});

		return (
			<List className={`${classes.listMenu} ${classes.horizontal}`}>
				{optionsList}
			</List>
		);
	}
}

Categories.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Categories);
