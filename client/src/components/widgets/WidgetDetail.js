/* eslint-disable max-lines */
import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Subject } from "rxjs";
import { debounceTime, filter, distinctUntilChanged } from "rxjs/operators";

import {
	makeStyles,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Chip,
	FormControlLabel,
	Checkbox,
	MenuItem,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import Input from "../.partials/Input";

import { WidgetContext } from "../../contexts/WidgetContext";
import { UserContext } from "../../contexts/UserContext";

import { getCities } from "../../api/weather";
import { getCoins, getStocks } from "../../api/finance";
import { addWidget, editWidget } from "../../api/widgets";

import { translate } from "../../utils/translations";

import { widgetDetail as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function WidgetDetail({ open, widget, widgetGroups, widgetRestrictions, onClose }) {
	const classes = useStyles();
	const { dispatch } = useContext(WidgetContext);
	const { user } = useContext(UserContext);
	const [type, setType] = useState("notifications");
	const [group, setGroup] = useState({ name: "Ungrouped", pos: widgetGroups.length });
	const [refreshRateMinutes, setRefreshRateMinutes] = useState(null);
	const [info, setInfo] = useState({});
	const [cities, setCities] = useState([]);
	const [coins, setCoins] = useState([]);
	const [stocks, setStocks] = useState([]);
	const [selectedCity, setSelectedCity] = useState(null);
	const [selectedCoins, setSelectedCoins] = useState([]);
	const [selectedStocks, setSelectedStocks] = useState([]);
	const [selectedTabs, setSelectedTabs] = useState([]);
	const tabs = [
		{ name: "In Queue", value: "inQueue" },
		{ name: "All", value: "all" },
		{ name: "Popular", value: "popular" },
		{ name: "Future", value: "future" },
	];

	const addGroupSubject = new Subject();
	const getCitiesSubject = new Subject();
	const getCoinsSubject = new Subject();
	const getStocksSubject = new Subject();
	const submitSubject = new Subject();

	useEffect(() => {
		const subscription = addGroupSubject
			.pipe(
				debounceTime(250),
				filter(name => name),
			)
			.subscribe(name => {
				widgetGroups.push({ name });

				setGroup({ name });
			});
		return () => subscription.unsubscribe();
	});

	useEffect(() => {
		const subscription = getCitiesSubject
			.pipe(
				debounceTime(250),
				filter(query => query),
			)
			.subscribe(async query => {
				const response = await getCities(query);

				if (response.status === 200) {
					setCities(response.data);
				}
			});
		return () => subscription.unsubscribe();
	});

	useEffect(() => {
		const subscription = getCoinsSubject
			.pipe(
				debounceTime(250),
				filter(query => query),
			)
			.subscribe(async query => {
				const response = await getCoins(query);

				if (response.status === 200) {
					setCoins(response.data);
				}
			});
		return () => subscription.unsubscribe();
	});

	useEffect(() => {
		const subscription = getStocksSubject
			.pipe(
				debounceTime(250),
				filter(query => query),
			)
			.subscribe(async query => {
				const response = await getStocks(query);

				if (response.status === 200) {
					setStocks(response.data);
				}
			});
		return () => subscription.unsubscribe();
	});

	useEffect(() => {
		const subscription = submitSubject.pipe(distinctUntilChanged((a, b) => a === b)).subscribe(async () => {
			if (widget) {
				const response = await editWidget({ ...widget, group, refreshRateMinutes, info });

				if (response.status === 200) {
					dispatch({ type: "EDIT_WIDGET", widget: response.data });
					onClose();
					setInfo({});
				}
			} else {
				const response = await addWidget({
					type,
					group,
					width: widgetRestrictions[type].minW,
					height: widgetRestrictions[type].minH,
					refreshRateMinutes,
					info,
				});

				if (response.status === 201) {
					dispatch({ type: "ADD_WIDGET", widget: response.data });
					onClose();
					setInfo({});
				}
			}
		});
		return () => subscription.unsubscribe();
	});

	useEffect(() => {
		if (widget) {
			setType(widget.type);
			if (widget.group) setGroup(widget.group);
			if (widget.refreshRateMinutes) setRefreshRateMinutes(widget.refreshRateMinutes);
			if (widget.info) setInfo(widget.info);

			if (widget.type === "finance") {
				const formattedCoins = widget.info.coins
					? widget.info.coins.split(",").map(coin => ({ symbol: coin }))
					: [];
				setSelectedCoins(formattedCoins);
				const formattedStocks = widget.info.stocks
					? widget.info.stocks.split(",").map(stock => ({ symbol: stock }))
					: [];
				setSelectedStocks(formattedStocks);
			} else if (widget.type === "tv") {
				setSelectedTabs(widget.info.tabs.map(tab => tabs.find(t => t.value === tab)));
			} else if (widget.type === "weather") {
				setSelectedCity({ name: widget.info.city, country: widget.info.country });
			}
		} else {
			const hasUngrouped = widgetGroups.find(g => g.name === "Ungrouped");

			setType("notifications");
			setGroup({ name: "Ungrouped", pos: hasUngrouped ? hasUngrouped.pos : widgetGroups.length });
			setRefreshRateMinutes(null);
			setInfo({});
			setSelectedCity(null);
			setSelectedCoins([]);
			setSelectedStocks([]);
			setSelectedTabs([]);
		}
	}, [widget]);

	function handleGetCities(e, query) {
		getCitiesSubject.next(query);
	}

	function handleSelectCity(e, city) {
		if (!city) return;

		setSelectedCity(city);
		setInfo({ city: city.name, country: city.country, lat: city.lat, lon: city.lon });
	}

	function handleGetCoins(e, query) {
		getCoinsSubject.next(query);
	}

	function handleSelectCoin(e, sCoins) {
		setSelectedCoins(sCoins);
		setInfo({ ...info, coins: sCoins.map(coin => coin.symbol).join(",") });
	}

	function handleGetStocks(e, query) {
		getStocksSubject.next(query);
	}

	function handleSelectStock(e, sStocks) {
		setSelectedStocks(sStocks);
		setInfo({ ...info, stocks: sStocks.map(stock => stock.symbol).join(",") });
	}

	function handleSelectTabs(e, sTabs) {
		setSelectedTabs(sTabs);
		setInfo({ tabs: sTabs.map(tab => tab.value) });
	}

	function handleChange(e) {
		if (e.target.value.includes("info.country")) {
			setInfo({ ...info, country: e.target.value.replace("info.country.", "") });
		} else if (e.target.id && e.target.id.includes("info")) {
			setInfo({
				...info,
				[e.target.id.replace("info.", "")]: ["true", "false"].includes(e.target.value)
					? e.target.value === "true"
					: e.target.value,
			});
		} else {
			setType(e.target.value);
		}
	}

	function handleChangeGroup(e, value) {
		if (value) setGroup(value);
	}

	function handleChangeRefreshRateMinutes(e) {
		setRefreshRateMinutes(e.target.value);
	}

	function handleAddGroup(e, name) {
		addGroupSubject.next(name);
	}

	function handleSubmit(e) {
		e.preventDefault();

		if (refreshRateMinutes !== null && refreshRateMinutes < 5) return false;

		submitSubject.next(info);

		return true;
	}

	function renderGroupOptionLabel(option) {
		return option.name || option;
	}

	function renderGroupInput(params) {
		return <Input {...params} label="Widget Group" variant="outlined" fullWidth margin="normal" />;
	}

	function renderCitiesOptionLabel(option) {
		return `${option.name}, ${option.country}`;
	}

	function renderCitiesInput(params) {
		return <Input {...params} label="City" variant="outlined" fullWidth margin="normal" />;
	}

	function renderTickersOptionLabel(option) {
		return `${option.symbol} - ${option.name || option.symbol}`;
	}

	function renderCoinsInput(params) {
		return <Input {...params} label="Coins" variant="outlined" fullWidth margin="normal" />;
	}

	function renderStocksInput(params) {
		return <Input {...params} label="Stocks" variant="outlined" fullWidth margin="normal" />;
	}

	function renderTags(value, getTagProps) {
		if (!value) return [];

		return value.map((option, index) => (
			<Chip
				key={option.symbol || option.value}
				color="primary"
				label={option.symbol || option.name}
				{...getTagProps({ index })}
			/>
		));
	}

	function renderTabsOptionLabel(option) {
		return option.name;
	}

	function renderTabsInput(params) {
		return <Input {...params} label="Tabs" variant="outlined" fullWidth margin="normal" />;
	}

	// eslint-disable-next-line complexity
	function renderFields() {
		switch (type) {
			case "notifications":
				return (
					<FormControlLabel
						control={
							<Checkbox
								color="primary"
								id="info.wrapTitle"
								checked={info.wrapTitle === true || info.wrapTitle === "true"}
								value={info.wrapTitle !== true && info.wrapTitle !== "true"}
								onChange={handleChange}
							/>
						}
						label="Wrap Notification Title"
					/>
				);
			case "reddit":
				return (
					<div>
						<Input
							id="info.subreddit"
							type="text"
							label="Subreddit"
							value={info.subreddit || ""}
							onChange={handleChange}
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
							margin="normal"
							variant="outlined"
							fullWidth
						/>
						<FormControlLabel
							control={
								<Checkbox
									color="primary"
									id="info.listView"
									checked={info.listView}
									value={!info.listView}
									onChange={handleChange}
								/>
							}
							label="List View"
						/>
					</div>
				);
			case "tv":
				return (
					<div>
						<Autocomplete
							value={selectedTabs}
							multiple
							limitTags={2}
							renderTags={renderTags}
							options={tabs || []}
							onChange={handleSelectTabs}
							className={classes.autocomplete}
							getOptionLabel={renderTabsOptionLabel}
							renderInput={renderTabsInput}
							fullWidth
						/>
						<FormControlLabel
							control={
								<Checkbox
									color="primary"
									id="info.listView"
									checked={info.listView}
									value={!info.listView}
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
			case "finance":
				return (
					<>
						<Autocomplete
							value={selectedCoins}
							multiple
							limitTags={2}
							renderTags={renderTags}
							options={coins || []}
							onInputChange={handleGetCoins}
							onChange={handleSelectCoin}
							className={classes.autocomplete}
							getOptionLabel={renderTickersOptionLabel}
							renderInput={renderCoinsInput}
							fullWidth
						/>
						<Autocomplete
							value={selectedStocks}
							multiple
							limitTags={2}
							renderTags={renderTags}
							options={stocks || []}
							onInputChange={handleGetStocks}
							onChange={handleSelectStock}
							className={classes.autocomplete}
							getOptionLabel={renderTickersOptionLabel}
							renderInput={renderStocksInput}
							fullWidth
						/>
					</>
				);
			case "price":
				const countries = [
					{ value: "au", displayName: "Australia" },
					{ value: "ca", displayName: "Canada" },
					{ value: "fr", displayName: "France" },
					{ value: "de", displayName: "Germany" },
					{ value: "it", displayName: "Italy" },
					{ value: "es", displayName: "Spain" },
					{ value: "uk", displayName: "UK" },
					{ value: "us", displayName: "USA" },
				];

				return (
					<div>
						<br />
						<Input
							label="Country"
							id="info.country"
							value={info.country ? `info.country.${info.country}` : ""}
							onChange={handleChange}
							variant="outlined"
							select
							fullWidth
							required
						>
							{countries.map(c => (
								<MenuItem key={c.value} value={`info.country.${c.value}`}>
									{c.displayName}
								</MenuItem>
							))}
						</Input>
						<Input
							id="info.productId"
							type="text"
							label="Product Id"
							value={info.productId || ""}
							onChange={handleChange}
							margin="normal"
							variant="outlined"
							fullWidth
							required
						/>
					</div>
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
			{ value: "finance", displayName: "Finance" },
			{ value: "tv", displayName: "TV" },
			{ value: "price", displayName: "Price" },
			{ value: "email", displayName: "Email" },
		];

		const nonAppWidgets = ["notifications", "weather", "finance", "price", "email"];
		const appTypes = user.apps ? user.apps.map(a => a.platform).concat(nonAppWidgets) : nonAppWidgets;
		types = types.filter(t => appTypes.includes(t.value));

		return (
			<>
				<Input
					label="Type"
					id="type"
					value={type}
					onChange={handleChange}
					variant="outlined"
					select
					fullWidth
					required
					disabled={Boolean(widget)}
				>
					{types.map(t => (
						<MenuItem key={t.value} value={t.value}>
							{t.displayName}
						</MenuItem>
					))}
				</Input>
				<Autocomplete
					freeSolo
					value={group}
					renderTags={renderTags}
					options={widgetGroups || []}
					onChange={handleChangeGroup}
					onInputChange={handleAddGroup}
					className={classes.autocomplete}
					getOptionLabel={renderGroupOptionLabel}
					renderInput={renderGroupInput}
					fullWidth
				/>
				<Input
					label="Refresh Rate (Minutes)"
					id="refreshRateMinutes"
					value={refreshRateMinutes}
					onChange={handleChangeRefreshRateMinutes}
					type="number"
					variant="outlined"
					fullWidth
					error={refreshRateMinutes !== null && refreshRateMinutes < 5}
					helperText="Refresh Rate has to be >= 5 minutes"
					style={{ marginTop: "5px" }}
				/>
			</>
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
			<form onSubmit={handleSubmit}>
				<DialogTitle id="simple-dialog-title">{widget ? "Edit Widget" : "New Widget"}</DialogTitle>
				<DialogContent>
					{renderTypes()}
					{renderFields()}
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="primary">
						{translate("close")}
					</Button>
					<Button type="submit" color="primary" autoFocus>
						{widget ? "Update" : "Add"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

WidgetDetail.propTypes = {
	open: PropTypes.bool.isRequired,
	widget: PropTypes.object,
	widgetGroups: PropTypes.array.isRequired,
	widgetRestrictions: PropTypes.object.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default WidgetDetail;
