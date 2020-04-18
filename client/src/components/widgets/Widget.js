import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import { widget as styles } from "../../styles/Widgets";

class Widget extends Component {
	constructor() {
		super();

		this.handleDelete = this.handleDelete.bind(this);
	}

	async handleDelete() {
		const { id, onDelete } = this.props;

		await onDelete(id);
	}

	render() {
		const { classes, editMode, editText, editIcon, content } = this.props;

		const display = editMode ? (
			<div className={classes.edit}>
				<IconButton className={classes.delete} onClick={this.handleDelete}>
					<i className="icofont-ui-delete" />
				</IconButton>
				<i className={`${editIcon} icofont-2x`} />
				<Typography variant="subtitle2">
					{editText}
				</Typography>
			</div>
		) : content;

		return display;
	}
}

Widget.propTypes = {
	classes: PropTypes.object.isRequired,
	id: PropTypes.string.isRequired,
	content: PropTypes.node.isRequired,
	editMode: PropTypes.bool.isRequired,
	editText: PropTypes.string.isRequired,
	editIcon: PropTypes.string.isRequired,
	onDelete: PropTypes.func.isRequired,
};

export default withStyles(styles)(Widget);
