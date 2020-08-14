import React from "react";
import PropTypes from "prop-types";

import { Button, Dialog, DialogContent, DialogTitle, DialogActions, DialogContentText } from "@material-ui/core";

import { translate } from "../../utils/translations";

function DeleteConfirmation({ open, onClose, onDelete, type }) {
	return (
		<Dialog
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			open={open}
			fullWidth
			maxWidth="xs"
		>
			<DialogTitle id="simple-dialog-title">{translate("deleteConfirmation")}</DialogTitle>
			<DialogContent>
				<DialogContentText>{translate("deleteConfirmationText", type, "#ec6e4c")}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					{translate("close")}
				</Button>
				<Button type="submit" style={{ color: "#ec6e4c" }} autoFocus onClick={onDelete}>
					{translate("delete")}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

DeleteConfirmation.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	type: PropTypes.string,
};

export default DeleteConfirmation;
