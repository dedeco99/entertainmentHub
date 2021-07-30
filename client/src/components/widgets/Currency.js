import React, { useState, useEffect } from "react";

import { makeStyles, Box, MenuItem } from "@material-ui/core";

import { twitch as twitchStyles } from "../../styles/Widgets";
import generalStyles from "../../styles/General";

import { getExchangeRates } from "../../api/finance";

import Input from "../.partials/Input";

const useStyles = makeStyles({ ...twitchStyles, ...generalStyles });

function Currency() {
	const classes = useStyles();
	const [currencies, setCurrencies] = useState([]);

	const [currencyConvertFrom, setCurrencyConvertFrom] = useState(0);
	const [currencyConvertFromRate, setCurrencyConvertFromRate] = useState("");

	const [currencyConvertTo, setCurrencyConvertTo] = useState(0);
	const [currencyConvertToRate, setCurrencyConvertToRate] = useState("");

	useEffect(() => {
		async function fetchData() {
			const response = await getExchangeRates();

			if (response.status === 200) {
				setCurrencies(response.data);
			}
		}

		fetchData();
	}, []);

	function handleChangeCurrencyConvertFrom(e) {
		setCurrencyConvertFrom(e.target.value);

		if (currencyConvertToRate) {
			setCurrencyConvertTo((e.target.value * currencyConvertFromRate).toFixed(2));
		}
	}

	function handleChangeCurrencyFromRate(e) {
		if (e.target.value !== currencyConvertToRate) {
			setCurrencyConvertFromRate(e.target.value);
			setCurrencyConvertTo((currencyConvertFrom * currencyConvertFromRate).toFixed(2));
		}
	}

	function handleChangeCurrencyConvertTo(e) {
		setCurrencyConvertTo(e.target.value);

		if (currencyConvertFromRate) {
			setCurrencyConvertFrom((e.target.value * currencyConvertToRate).toFixed(2));
		}
	}

	function handleChangeCurrencyToRate(e) {
		if (e.target.value !== currencyConvertFromRate) {
			setCurrencyConvertToRate(e.target.value);
			setCurrencyConvertFrom((currencyConvertTo * currencyConvertToRate).toFixed(2));
		}
	}

	return (
		<Box className={classes.root} style={{ textAlign: "center" }}>
			<Box style={{ marginTop: "40px" }}>
				<Input
					label="Currency from Rate"
					id="currencyConvertFromRate"
					value={currencyConvertFromRate}
					onChange={handleChangeCurrencyFromRate}
					variant="outlined"
					select
					style={{ width: "80%" }}
				>
					{Object.entries(currencies).map(p => (
						<MenuItem key={p[0]} value={p[1]}>
							{p[0]}
						</MenuItem>
					))}
				</Input>

				<Input
					label="Currency from Rate"
					id="currencyConvertFrom"
					value={currencyConvertFrom}
					onChange={handleChangeCurrencyConvertFrom}
					type="number"
					variant="outlined"
					style={{ width: "80%", marginTop: "10px" }}
				/>

				<Input
					label="Currency to Rate"
					id="currencyConvertFromRate"
					value={currencyConvertToRate}
					onChange={handleChangeCurrencyToRate}
					variant="outlined"
					select
					style={{ width: "80%", marginTop: "30px" }}
				>
					{Object.entries(currencies).map(p => (
						<MenuItem key={p[0]} value={p[1]}>
							{p[0]}
						</MenuItem>
					))}
				</Input>

				<Input
					label="Currency to Rate"
					id="currencyConvertFrom"
					value={currencyConvertTo}
					onChange={handleChangeCurrencyConvertTo}
					type="number"
					variant="outlined"
					style={{ width: "80%", marginTop: "10px" }}
				/>
			</Box>
		</Box>
	);
}

export default Currency;
