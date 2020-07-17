import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import Zoom from "@material-ui/core/Zoom";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import { WidgetContext } from "../../contexts/WidgetContext";

import { deleteWidget } from "../../api/widgets";

import { widget as useStyles } from "../../styles/Widgets";

function Widget({ id, content, borderColor, editText, editIcon, editMode }) {
	const classes = useStyles({ borderColor });
	const { dispatch } = useContext(WidgetContext);
	const [refreshToken, setRefreshToken] = useState(new Date());

	async function handleDelete() {
		const response = await deleteWidget(id);

		if (response.status < 400) {
			dispatch({ type: "DELETE_WIDGET", widget: response.data });
		}
	}

	function handleRefresh() {
		setRefreshToken(new Date());
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
			<Box position="relative" className={classes.root}>
				{React.cloneElement(content, { key: refreshToken })}
				<Paper component={Box} className="widgetOptions" p={1} display="none" position="absolute" top="-42px" right="0px">
					<IconButton size="small" onClick={handleRefresh}>
						<i className="icofont-refresh" />
					</IconButton>
				</Paper>
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
