import React, { useContext } from "react";
import IconButton from "@material-ui/core/IconButton";

import { WidgetContext } from "../../contexts/WidgetContext";

function EditModeToggle() {
	const { widgetState, dispatch } = useContext(WidgetContext);
	const { editMode } = widgetState;

	function handleToggleEdit() {
		dispatch({ type: "SET_EDIT_MODE", editMode: !editMode });
	}

	return (
		<IconButton onClick={handleToggleEdit}>
			<i className="icofont-ui-edit" />
		</IconButton>
	);
}

export default EditModeToggle;
