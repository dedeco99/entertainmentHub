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
			type: "notifications",
			info: {
				subreddit: "",

				lat: 0,
				lon: 0,
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
		const { onAdd } = this.props;
		const { type, info } = this.state;

		await onAdd({ type, info });
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
			case "weather":
				return (
					<div>
						<Input
							id="info.lat"
							type="text"
							label="Latitude"
							value={info.lat}
							onChange={this.handleChange}
							onKeyPress={this.handleKeyPress}
							margin="normal"
							variant="outlined"
							fullWidth
							required
						/>
						<Input
							id="info.lon"
							type="text"
							label="Longitude"
							value={info.lon}
							onChange={this.handleChange}
							onKeyPress={this.handleKeyPress}
							margin="normal"
							variant="outlined"
							fullWidth
							required
						/>
					</div>
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
							<option value="notifications">{"Notifications"}</option>
							<option value="reddit">{"Reddit"}</option>
							<option value="weather">{"Weather"}</option>
							<option value="tv">{"TV"}</option>
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
	onAdd: PropTypes.func.isRequired,
};

export default WidgetDetail;
