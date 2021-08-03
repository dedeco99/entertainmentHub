import React, { useState, useEffect } from "react";
import { Subject } from "rxjs";
import { debounceTime, filter } from "rxjs/operators";

import { makeStyles, Box } from "@material-ui/core";

import { twitch as twitchStyles } from "../../styles/Widgets";
import generalStyles from "../../styles/General";

import { getExchangeRates } from "../../api/finance";

import Input from "../.partials/Input";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles({ ...twitchStyles, ...generalStyles });

function Currency() {
	const classes = useStyles();
	const [currencies, setCurrencies] = useState([]);

	const [currencySelectFromTo, setCurrencySelectFromTo] = useState(null);
	const [currencySelectFromToExchangeRate, setCurrencySelectFromToExchangeRate] = useState(null);
	const [currencySelectFromToValue, setCurrencySelectFromToValue] = useState(0.0);

	const [currencySelectToFrom, setCurrencySelectToFrom] = useState(null);
	const [currencySelectToFromExchangeRate, setCurrencySelectToFromExchangeRate] = useState(null);
	const [currencySelectToFromValue, setCurrencySelectToFromValue] = useState(0.0);

	const getCitiesSubject = new Subject();

	useEffect(() => {
		const subscription = getCitiesSubject
			.pipe(
				debounceTime(250),
				filter(query => query),
			)
			.subscribe(async query => {
				const response = await getExchangeRates(query);

				if (response.status === 200) {
					setCurrencies(response.data);
				}
			});
		return () => subscription.unsubscribe();
	});

	function renderCurrencyOptionLabel(option) {
		return `${option.toString().split(",")[0]}`;
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

	function handleGetCurrencies(e, query) {
		getCitiesSubject.next(query);
	}

	function handleSelectCurrencyFromTo(e, currency) {
		if (!currency) return;

		setCurrencySelectFromTo(currency.toString().split(",")[0]);
		setCurrencySelectFromToExchangeRate(Number(currency.toString().split(",")[1]));

		if (currencySelectToFromExchangeRate && currencySelectFromToValue) {
			setCurrencySelectToFromValue(
				(currencySelectFromToValue / Number(currency.toString().split(",")[1])).toFixed(2),
			);
		}
	}

	function handleSelectCurrencyToFrom(e, currency) {
		if (!currency) return;

		setCurrencySelectToFrom(currency.toString().split(",")[0]);
		setCurrencySelectToFromExchangeRate(Number(currency.toString().split(",")[1]));

		if (currencySelectFromToExchangeRate && currencySelectToFromValue) {
			setCurrencySelectToFromValue((currencySelectToFromValue / currencySelectFromToExchangeRate).toFixed(2));
		}
	}

	function handleChangeCurrencyConvertFrom(e) {
		setCurrencySelectFromToValue(e.target.value);

		if (currencySelectToFromExchangeRate) {
			setCurrencySelectToFromValue((e.target.value / currencySelectFromToExchangeRate).toFixed(2));
		}
	}

	function handleChangeCurrencyConvertTo(e) {
		setCurrencySelectToFromValue(e.target.value);

		if (currencySelectFromToExchangeRate) {
			setCurrencySelectFromToValue((e.target.value * currencySelectFromToExchangeRate).toFixed(2));
		}
	}

	return (
		<Box className={classes.root} style={{ textAlign: "center" }}>
			<Box style={{ display: "flex" }}>
				<Autocomplete
					value={currencySelectFromTo}
					getOptionSelected={option => option[0]}
					options={Object.entries(currencies) || []}
					onInputChange={handleGetCurrencies}
					onChange={handleSelectCurrencyFromTo}
					getOptionLabel={renderCurrencyOptionLabel}
					renderInput={params => renderCurrenciesInput(params, "currencyFromTo")}
					style={{ width: "90%", padding: "10px" }}
				/>

				<Autocomplete
					value={currencySelectToFrom}
					options={Object.entries(currencies) || []}
					onInputChange={handleGetCurrencies}
					getOptionSelected={option => option[0]}
					onChange={handleSelectCurrencyToFrom}
					getOptionLabel={renderCurrencyOptionLabel}
					renderInput={params => renderCurrenciesInput(params, "currencyToFrom")}
					style={{ width: "90%", padding: "10px" }}
				/>
			</Box>

			<Box style={{ display: "flex" }}>
				<Input
					label="Currency From"
					id="currencyConvertFromTo"
					value={currencySelectFromToValue}
					onChange={handleChangeCurrencyConvertFrom}
					type="number"
					variant="outlined"
					style={{ width: "83%", paddingRight: "10px", marginLeft: "10px" }}
				/>

				<Input
					label="Currency To"
					id="currencyConvertToFrom"
					value={currencySelectToFromValue}
					onChange={handleChangeCurrencyConvertTo}
					type="number"
					variant="outlined"
					style={{ width: "83%", paddingRight: "10px", marginLeft: "10px" }}
				/>
			</Box>
		</Box>
	);
}

export default Currency;
