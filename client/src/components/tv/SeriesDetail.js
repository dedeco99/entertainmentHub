import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";

import Input from "../.partials/Input";

import { translate } from "../../utils/translations";

function SeriesDetail({ open, series, editSeries, onClose }) {
	const [title, setTitle] = useState("");

	useEffect(() => {
		if (series) {
			setTitle(series.displayName);
		}
	}, [series]); // eslint-disable-line

	function handleChange(e) {
		setTitle(e.target.value);
	}

	async function handleSubmit(e) {
		e.preventDefault();

		await editSeries(series._id, { displayName: title });
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
				<DialogTitle id="simple-dialog-title">{"Edit Series"}</DialogTitle>
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
						{"Close"}
					</Button>
					<Button type="submit" color="primary" autoFocus>
						{translate("edit")}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

SeriesDetail.propTypes = {
	open: PropTypes.bool.isRequired,
	series: PropTypes.object,
	editSeries: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default SeriesDetail;
