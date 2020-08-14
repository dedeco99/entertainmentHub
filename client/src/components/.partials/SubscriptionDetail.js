import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";

import Input from "./Input";

import { translate } from "../../utils/translations";

function SubscriptionDetail({ open, subscription, editSubscription, onClose }) {
	const [title, setTitle] = useState("");

	useEffect(() => {
		if (subscription) {
			setTitle(subscription.displayName);
		}
	}, [subscription]); // eslint-disable-line

	function handleChange(e) {
		setTitle(e.target.value);
	}

	async function handleSubmit(e) {
		e.preventDefault();

		await editSubscription(subscription._id, { displayName: title });
	}

	return (
		<Dialog
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			open={open}
			fullWidth
			maxWidth="xs"
		>
			<form onSubmit={handleSubmit}>
				<DialogTitle id="simple-dialog-title">{translate("editSubscription")}</DialogTitle>
				<DialogContent>
					<Input
						id="title"
						type="text"
						label={translate("title")}
						value={title}
						onChange={handleChange}
						margin="normal"
						variant="outlined"
						fullWidth
						required
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="primary">
						{translate("close")}
					</Button>
					<Button type="submit" color="primary" autoFocus>
						{translate("edit")}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

SubscriptionDetail.propTypes = {
	open: PropTypes.bool.isRequired,
	subscription: PropTypes.object,
	editSubscription: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default SubscriptionDetail;
