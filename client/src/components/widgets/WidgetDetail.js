import React, { useState, useContext } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";

import Input from "../.partials/Input";

import { WidgetContext } from "../../contexts/WidgetContext";
import { UserContext } from "../../contexts/UserContext";

import { getCities } from "../../api/weather";
import { getCoins } from "../../api/crypto";
import { addWidget } from "../../api/widgets";

import { widgetDetail as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function WidgetDetail({ open, onClose }) {
	const classes = useStyles();
	const { dispatch } = useContext(WidgetContext);
	const { user } = useContext(UserContext);
	const [type, setType] = useState("notifications");
	const [info, setInfo] = useState({});
	const [typingTimeout, setTypingTimeout] = useState(null);
	const [cities, setCities] = useState([]);
	const [coins, setCoins] = useState([]);

	const [selectedCity, setSelectedCity] = useState(null);
	const [selectedCoins, setSelectedCoins] = useState([]);

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

		setSelectedCity(city);
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

	function handleSelectCoin(e, sCoins) {
		setSelectedCoins(sCoins);
		setInfo({ coins: sCoins.map(coin => coin.symbol).join(",") });
	}

	function handleChange(e) {
		if (e.target.id && e.target.id.includes("info")) {
			setInfo({ ...info, [e.target.id.replace("info.", "")]: e.target.value });
		} else {
			setType(e.target.value);
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();
		
		const response = await addWidget({ type, info });

		if (response.status < 400) {
			dispatch({ type: "ADD_WIDGET", widget: response.data });
		}

		setInfo({});
	}

	function handleKeyPress(event) {
		if (event.key === "Enter") handleSubmit();
	}

	function renderCitiesOptionLabel(option) {
		return `${option.name}, ${option.country}`;
	}

	function renderCitiesInput(params) {
		return <Input {...params} label="City" variant="outlined" fullWidth margin="normal" />;
	}

	function renderCoinsOptionLabel(option) {
		return `${option.symbol} - ${option.name}`;
	}

	function renderCoinsInput(params) {
		return <Input {...params} label="Coins" variant="outlined" fullWidth margin="normal" />;
	}

	function renderTags(value, getTagProps) {
		if (!value) return [];

		return value.map((option, index) => (
			<Chip key={option.symbol} color="primary" label={option.symbol} {...getTagProps({ index })} />
		));
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
									color="primary"
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
						value={selectedCity}
						options={cities || []}
						onInputChange={handleGetCities}
						onChange={handleSelectCity}
						className={classes.autocomplete}
						getOptionLabel={renderCitiesOptionLabel}
						renderInput={renderCitiesInput}
						fullWidth
					/>
				);
			case "crypto":
				return (
					<Autocomplete
						value={selectedCoins}
						multiple
						limitTags={2}
						renderTags={renderTags}
						options={coins || []}
						onInputChange={handleGetCoins}
						onChange={handleSelectCoin}
						className={classes.autocomplete}
						getOptionLabel={renderCoinsOptionLabel}
						renderInput={renderCoinsInput}
						fullWidth
					/>
				);
			default:
				return null;
		}
	}

	function renderTypes() {
		let types = [
			{ value: "notifications", displayName: "Notifications" },
			{ value: "reddit", displayName: "Reddit" },
			{ value: "twitch", displayName: "Twitch" },
			{ value: "weather", displayName: "Weather" },
			{ value: "crypto", displayName: "Crypto" },
			{ value: "tv", displayName: "TV" },
		];

		const nonAppWidgets = ["notifications", "weather", "crypto"];
		const appTypes = user.apps ? user.apps.map(a => a.platform).concat(nonAppWidgets) : nonAppWidgets;
		types = types.filter(t => appTypes.includes(t.value));

		return (
			<Input
				label="Type"
				id="type"
				value={type}
				onChange={handleChange}
				variant="outlined"
				select
				fullWidth
				required
			>
				{types.map(t => (
					<MenuItem key={t.value} value={t.value}>
						{t.displayName}
					</MenuItem>
				))}
			</Input>
		);
	}

	return (
			<Dialog
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				open={open}
				fullWidth
				maxWidth="xs"
			>
				<form onSubmit={handleSubmit} onClick={onClose}>
					<DialogTitle id="simple-dialog-title">{"New Widget"}</DialogTitle>
					<DialogContent>
						{renderTypes()}
						{renderFields()}
					</DialogContent>
					<DialogActions>
						<Button onClick={onClose} color="primary">
							{"Close"}
						</Button>
						<Button type="submit" color="primary" autoFocus>
							{"Add"}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
	);
}

WidgetDetail.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default WidgetDetail;
