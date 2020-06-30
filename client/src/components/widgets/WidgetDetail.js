import React, { useState, useContext } from "react";
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

import { WidgetContext } from "../../contexts/WidgetContext";

import { getCities } from "../../api/weather";
import { getCoins } from "../../api/crypto";
import { addWidget } from "../../api/widgets";

import { widgetDetail as useStyles } from "../../styles/Widgets";

function WidgetDetail({ open, onClose }) {
	const classes = useStyles();
	const { dispatch } = useContext(WidgetContext);
	const [type, setType] = useState("notifications");
	const [info, setInfo] = useState({});
	const [typingTimeout, setTypingTimeout] = useState(null);
	const [cities, setCities] = useState([]);
	const [coins, setCoins] = useState([]);

	function handleGetCities(e, filter) {
		if (!filter) return;

		if (typingTimeout) clearTimeout(typingTimeout);

		const timeout = setTimeout(async () => {
			const response = await getCities(filter);

			if (response.data) {
				setCities(response.data);
			}
		}, 500);

		setTypingTimeout(timeout);
	}

	function handleSelectCity(e, city) {
		if (!city) return;

		setInfo({ city: city.name, country: city.country, lat: city.lat, lon: city.lon });
	}

	function handleGetCoins(e, filter) {
		if (!filter) return;

		if (typingTimeout) clearTimeout(typingTimeout);

		const timeout = setTimeout(async () => {
			const response = await getCoins(filter);

			if (response.data) {
				setCoins(response.data);
			}
		}, 500);

		setTypingTimeout(timeout);
	}

	function handleSelectCoin(e, selectedCoins) {
		setInfo({ coins: selectedCoins.map(coin => coin.symbol).join(",") });
	}

	function handleChange(e) {
		if (e.target.id.includes("info")) {
			setInfo({ ...info, [e.target.id.replace("info.", "")]: e.target.value });
		} else {
			setType(e.target.value);
		}
	}

	async function handleSubmit() {
		const response = await addWidget({ type, info });

		if (response.status < 400) {
			dispatch({ type: "ADD_WIDGET", widget: response.data });
		}

		setInfo({});
	}

	function handleKeyPress(event) {
		if (event.key === "Enter") handleSubmit();
	}

	function renderFields() {
		switch (type) {
			case "reddit":
				return (
					<div>
						<Input
							id="info.subreddit"
							type="text"
							label="Subreddit"
							value={info.subreddit || ""}
							onChange={handleChange}
							onKeyPress={handleKeyPress}
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
							onChange={handleChange}
							onKeyPress={handleKeyPress}
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
									onChange={handleChange}
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
						onInputChange={handleGetCities}
						onChange={handleSelectCity}
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
						onInputChange={handleGetCoins}
						onChange={handleSelectCoin}
						className={classes.autocomplete}
						getOptionLabel={option => `${option.symbol} - ${option.name}`}
						renderInput={params => <TextField {...params} label="Coins" variant="outlined" fullWidth margin="normal" />}
					/>
				);
			default: return null;
		}
	}

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
						onChange={handleChange}
						fullWidth
						required
					>
						<option value="notifications">{"Notifications"}</option>
						<option value="reddit">{"Reddit"}</option>
						<option value="twitch">{"Twitch"}</option>
						<option value="weather">{"Weather"}</option>
						<option value="crypto">{"Crypto"}</option>
						<option value="tv">{"TV"}</option>
					</Select>
				</FormControl>
				{renderFields()}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					{"Close"}
				</Button>
				<Button onClick={handleSubmit} color="primary" autoFocus>
					{"Add"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

WidgetDetail.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default WidgetDetail;
