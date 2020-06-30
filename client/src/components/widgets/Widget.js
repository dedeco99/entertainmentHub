import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import { WidgetContext } from "../../contexts/WidgetContext";

import { deleteWidget } from "../../api/widgets";

import { widget as styles } from "../../styles/Widgets";

class Widget extends Component {
	constructor() {
		super();

		this.handleDelete = this.handleDelete.bind(this);
	}

	async handleDelete() {
		const { id } = this.props;
		const { dispatch } = this.context;

		const response = await deleteWidget(id);

		if (response.status < 400) {
			dispatch({ type: "DELETE_WIDGET", widget: response.data });
		}
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

Widget.contextType = WidgetContext;

Widget.propTypes = {
	classes: PropTypes.object.isRequired,
	id: PropTypes.string.isRequired,
	content: PropTypes.node.isRequired,
	editText: PropTypes.string.isRequired,
	editIcon: PropTypes.string.isRequired,
	editMode: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Widget);
