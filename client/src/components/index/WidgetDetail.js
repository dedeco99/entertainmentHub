import React, { Component } from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

import Input from "../.partials/Input";

class WidgetDetail extends Component {
	constructor() {
		super();
		this.state = {
			type: "",
			info: {
				subreddit: "",
			},
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleChange(e) {
		const { info } = this.state;

		if (e.target.id.includes("info")) {
			this.setState({ info: { ...info, [e.target.id.replace("info.", "")]: e.target.value } });
		} else {
			this.setState({ [e.target.id]: e.target.value });
		}
	}

	async handleSubmit() {
		const { onAddWidget } = this.props;
		const { type, info } = this.state;

		await onAddWidget({ type, info });
	}

	handleKeyPress(event) {
		if (event.key === "Enter") this.handleSubmit();
	}

	renderFields() {
		const { type, info } = this.state;

		switch (type) {
			case "reddit":
				return (
					<Input
						id="info.subreddit"
						type="text"
						label="Subreddit"
						value={info.subreddit}
						onChange={this.handleChange}
						onKeyPress={this.handleKeyPress}
						margin="normal"
						variant="outlined"
						fullWidth
						required
					/>
				);
			default: return null;
		}
	}

	render() {
		const { open, onClose } = this.props;
		const { type } = this.state;

		return (
			<Dialog
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				open={open}
			>
				<DialogTitle id="simple-dialog-title">{"New Widget"}</DialogTitle>
				<DialogContent>
					<FormControl variant="outlined">
						<InputLabel htmlFor="outlined-age-native-simple">{"Type"}</InputLabel>
						<Select
							native
							label="Type"
							id="type"
							value={type}
							onChange={this.handleChange}
							fullWidth
							required
						>
							<option value="notifications">{"notifications"}</option>
							<option value="reddit">{"reddit"}</option>
						</Select>
					</FormControl>
					{this.renderFields()}
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="primary">
						{"Close"}
					</Button>
					<Button onClick={this.handleSubmit} color="primary" autoFocus>
						{"Add"}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

WidgetDetail.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onAddWidget: PropTypes.func.isRequired,
};

export default WidgetDetail;
