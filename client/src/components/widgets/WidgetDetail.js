import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import Input from "../.partials/Input";

import { getCities } from "../../api/weather";
import { getCoins } from "../../api/crypto";

import { widgetDetail as styles } from "../../styles/Widgets";

class WidgetDetail extends Component {
	constructor() {
		super();
		this.state = {
			type: "notifications",
			info: {},

			typingTimeout: null,
			cities: [],
			coins: [],
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);

		this.handleGetCities = this.handleGetCities.bind(this);
		this.handleSelectCity = this.handleSelectCity.bind(this);
		this.handleGetCoins = this.handleGetCoins.bind(this);
		this.handleSelectCoin = this.handleSelectCoin.bind(this);
	}

	handleGetCities(e, filter) {
		const { typingTimeout } = this.state;

		if (!filter) return;

		if (typingTimeout) clearTimeout(typingTimeout);

		const timeout = setTimeout(async () => {
			const response = await getCities(filter);

			if (response.data) {
				this.setState({ cities: response.data });
			}
		}, 500);

		this.setState({ typingTimeout: timeout });
	}

	handleSelectCity(e, city) {
		if (!city) return;

		this.setState({ info: { city: city.name, country: city.country, lat: city.lat, lon: city.lon } });
	}

	handleGetCoins(e, filter) {
		const { typingTimeout } = this.state;

		if (!filter) return;

		if (typingTimeout) clearTimeout(typingTimeout);

		const timeout = setTimeout(async () => {
			const response = await getCoins(filter);

			if (response.data) {
				this.setState({ coins: response.data });
			}
		}, 500);

		this.setState({ typingTimeout: timeout });
	}

	handleSelectCoin(e, coins) {
		this.setState({ info: { coins: coins.map(coin => coin.symbol).join(",") } });
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

		this.setState({ info: {} });
	}

	handleKeyPress(event) {
		if (event.key === "Enter") this.handleSubmit();
	}

	renderFields() {
		const { classes } = this.props;
		const { type, info, cities, coins } = this.state;

		switch (type) {
			case "reddit":
				return (
					<div>
						<Input
							id="info.subreddit"
							type="text"
							label="Subreddit"
							value={info.subreddit || ""}
							onChange={this.handleChange}
							onKeyPress={this.handleKeyPress}
							margin="normal"
							variant="outlined"
							fullWidth
							required
						/>
						<Input
							id="info.search"
							type="text"
							label="Search"
							value={info.search || ""}
							onChange={this.handleChange}
							onKeyPress={this.handleKeyPress}
							margin="normal"
							variant="outlined"
							fullWidth
						/>
						<FormControlLabel
							control={
								<Checkbox
									id="info.listView"
									checked={info.listView === "true"}
									value={info.listView !== "true"}
									onChange={this.handleChange}
								/>
							}
							label="List View"
						/>
					</div>
				);
			case "weather":
				return (
					<Autocomplete
						options={cities || []}
						onInputChange={this.handleGetCities}
						onChange={this.handleSelectCity}
						className={classes.autocomplete}
						getOptionLabel={option => `${option.name}, ${option.country}`}
						renderInput={params => <TextField {...params} label="Cidade" variant="outlined" fullWidth margin="normal" />}
					/>
				);
			case "crypto":
				return (
					<Autocomplete
						multiple
						limitTags={2}
						renderTags={(value, getTagProps) => {
							if (value) {
								return value.map((option, index) => (
									<Chip key={option.symbol} label={option.symbol} {...getTagProps({ index })} />
								));
							}

							return [];
						}}
						options={coins || []}
						onInputChange={this.handleGetCoins}
						onChange={this.handleSelectCoin}
						className={classes.autocomplete}
						getOptionLabel={option => `${option.symbol} - ${option.name}`}
						renderInput={params => <TextField {...params} label="Coins" variant="outlined" fullWidth margin="normal" />}
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
							<option value="crypto">{"Crypto"}</option>
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
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WidgetDetail);
