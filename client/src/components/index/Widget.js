import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";

const styles = () => ({
	edit: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		backgroundColor: "#212121",
		height: "100%",
		width: "100%",
	},
});

class Widget extends Component {
	render() {
		const { classes, editMode, editText, editIcon, content } = this.props;

		const display = editMode
			? (
				<div className={classes.edit}>
					<i className={`${editIcon} icofont-2x`} />
					<Typography variant="subtitle2">
						{ editText }
					</Typography>
				</div>
			) : content;

		return display;
	}
}

Widget.propTypes = {
	classes: PropTypes.object,
	editMode: PropTypes.bool,
	editText: PropTypes.string,
	editIcon: PropTypes.string,
	content: PropTypes.node,
};

export default withStyles(styles)(Widget);
