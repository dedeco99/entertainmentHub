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

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { getCities } from "../../actions/weather";

class WidgetDetail extends Component {
	constructor() {
		super();
		this.state = {
			type: "notifications",
			info: {
				subreddit: "",

				city: "",
				country: "",
				lat: 0,
				lon: 0,
			},

			filter: "",
			typingTimeout: null,
			cities: [],
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);

		this.getCities = this.getCities.bind(this);
		this.selectCity = this.selectCity.bind(this);
	}

	getCities(e, filter) {
		const { typingTimeout } = this.state;

		if (!filter) return;

		this.setState({ filter });

		if (typingTimeout) clearTimeout(typingTimeout);

		const timeout = setTimeout(async () => {
			const response = await getCities(filter);

			if (response.data) {
				this.setState({ cities: response.data });
			}
		}, 500);

		this.setState({ typingTimeout: timeout });
	}

	selectCity(e, city) {
		const { info } = this.state;

		this.setState({
			info: {
				...info,
				city: city.name,
				country: city.country,
				lat: city.lat,
				lon: city.lon
			}
		});
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
		const { type, info, filter, cities } = this.state;

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
					<Autocomplete
						options={cities}
						onInputChange={this.getCities}
						onChange={this.selectCity}
						style={{ width: 300 }}
						getOptionLabel={option => option.name}
						renderInput={params => <TextField {...params} label="Cidade" variant="outlined" fullWidth margin="normal" />}
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
