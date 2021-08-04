import React, { useContext, useState, useEffect } from "react";

import { makeStyles, Box } from "@material-ui/core";

import { UserContext } from "../../contexts/UserContext";

import { twitch as twitchStyles } from "../../styles/Widgets";
import generalStyles from "../../styles/General";

import { getExchangeRates } from "../../api/finance";

import Input from "../.partials/Input";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles({ ...twitchStyles, ...generalStyles });

function CurrencyConverter() {
	const classes = useStyles();
	const { user } = useContext(UserContext);
	const [currencies, setCurrencies] = useState([]);
	const [fromCurrency, setFromCurrency] = useState(user.settings.currency);
	const [toCurrency, setToCurrency] = useState(null);
	const [fromValue, setFromValue] = useState(0);
	const [toValue, setToValue] = useState(0);

	async function handleGetExchangeRates(base) {
		const response = await getExchangeRates(base);

		if (response.status === 200) {
			setCurrencies(response.data);

			if (fromValue) setToValue(Number(fromValue) * response.data[toCurrency]);
		}
	}

	useEffect(() => {
		handleGetExchangeRates(fromCurrency);
	}, []);

	async function handleFromCurrencyChange(e, value) {
		setFromCurrency(value);

		await handleGetExchangeRates(value);
	}

	function handleToCurrencyChange(e, value) {
		setToCurrency(value);

		if (fromValue) setToValue(Number(fromValue) * currencies[value]);
	}

	function handleFromValueChange(e) {
		setFromValue(Number(e.target.value));
		setToValue(Number(e.target.value) * currencies[toCurrency]);
	}

	function handleToValueChange(e) {
		setToValue(Number(e.target.value));
		setFromValue(Number(e.target.value) / currencies[toCurrency]);
	}
	function renderCurrenciesInput(params, currencyFromTo) {
		return (
			<Input
				{...params}
				label={currencyFromTo === "currencyFromTo" ? "Currency From" : "Currency To"}
				variant="outlined"
				fullWidth
				margin="normal"
			/>
		);
	}

	return (
		<Box
			className={classes.root}
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
		>
			<Box display="flex" width="100%">
				<Autocomplete
					value={fromCurrency}
					options={Object.keys(currencies) || []}
					onChange={handleFromCurrencyChange}
					renderInput={params => renderCurrenciesInput(params, "currencyFromTo")}
					fullWidth
					style={{ margin: "0px 10px" }}
				/>
				<Autocomplete
					value={toCurrency}
					options={Object.keys(currencies) || []}
					onChange={handleToCurrencyChange}
					renderInput={params => renderCurrenciesInput(params, "currencyToFrom")}
					fullWidth
					style={{ margin: "0px 10px" }}
				/>
			</Box>
			<Box display="flex" width="100%">
				<Input
					label="Currency From"
					value={fromValue}
					onChange={handleFromValueChange}
					disabled={!fromCurrency || !toCurrency}
					type="number"
					variant="outlined"
					fullWidth
					style={{ margin: "10px" }}
				/>
				<Input
					label="Currency To"
					value={toValue}
					onChange={handleToValueChange}
					disabled={!fromCurrency || !toCurrency}
					type="number"
					variant="outlined"
					fullWidth
					style={{ margin: "10px" }}
				/>
			</Box>
		</Box>
	);
}

export default CurrencyConverter;
