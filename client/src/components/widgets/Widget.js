import React, { useContext } from "react";
import PropTypes from "prop-types";

import Zoom from "@material-ui/core/Zoom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import { WidgetContext } from "../../contexts/WidgetContext";
import { UserContext } from "../../contexts/UserContext";

import { deleteWidget } from "../../api/widgets";

import { widget as useStyles } from "../../styles/Widgets";

function Widget({ id, content, borderColor, editText, editIcon, editMode }) {
	const { user } = useContext(UserContext);

	const classes = useStyles({ borderColor: (user.settings && user.settings.borderColor ? borderColor : null) });
	const { dispatch } = useContext(WidgetContext);

	async function handleDelete() {
		const response = await deleteWidget(id);

		if (response.status < 400) {
			dispatch({ type: "DELETE_WIDGET", widget: response.data });
		}
	}

	if (editMode) {
		return (
			<div className={classes.root}>
				<IconButton className={classes.delete} onClick={handleDelete}>
					<i className="icofont-ui-delete" />
				</IconButton>
				<i className={`${editIcon} icofont-2x`} />
				<Typography variant="subtitle2">
					{editText}
				</Typography>
			</div>
		);
	}

	return (
		<Zoom in>
			<Box className={classes.root}>
				{content}
			</Box>
		</Zoom>
	);
}

Widget.propTypes = {
	id: PropTypes.string.isRequired,
	content: PropTypes.node.isRequired,
	borderColor: PropTypes.string,
	editText: PropTypes.string.isRequired,
	editIcon: PropTypes.string.isRequired,
	editMode: PropTypes.bool.isRequired,
};

export default Widget;
