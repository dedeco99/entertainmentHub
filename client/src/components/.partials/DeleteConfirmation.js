import React, { useContext } from "react";
import PropTypes from "prop-types";

import { 
    Button,  
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    DialogContentText
} from "@material-ui/core";

import { translate } from "../../utils/translations";

function DeleteConfirmation({ open, onClose, deleteFuncion, type }) {

	return (
		<Dialog
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			open={open}
			fullWidth
			maxWidth="xs"
		>
			<DialogTitle id="simple-dialog-title">{translate("deleteConfirmation")}</DialogTitle>
				<DialogContent style={{ display:"flex" }}>
                    <DialogContentText style={{ paddingRight:"4px" }}> {translate("deleteConfirmationText")} </DialogContentText>
                    <DialogContentText style={{ color:"#ec6e4c" }}> { type }</DialogContentText>
                    <DialogContentText> {"?" }</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="primary">
						{translate("close")}
					</Button>
					<Button type="submit" style={{ color:"#ec6e4c" }} autoFocus onClick={deleteFuncion}>
						{translate("delete")}
					</Button>
				</DialogActions>
		</Dialog>
	);
}

DeleteConfirmation.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    deleteFuncion: PropTypes.func.isRequired,
    type: PropTypes.string,
};

export default DeleteConfirmation;
