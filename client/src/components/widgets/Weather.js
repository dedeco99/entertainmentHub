import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles, Zoom, Typography, Box, Tooltip } from "@material-ui/core";

import Loading from "../.partials/Loading";

import { getWeather } from "../../api/weather";

import { formatDate } from "../../utils/utils";

import { weather as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function Weather({ city, country, lat, lon, widgetDimensions }) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [weather, setWeather] = useState(false);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			setOpen(false);

			const response = await getWeather(lat, lon);

			if (response.status === 200 && isMounted) {
				setWeather(response.data);
				setOpen(true);
			}
		}

		fetchData();

		return () => (isMounted = false);
	}, [city, country, lat, lon]);

	function showFeelsLike() {
		if (Math.round(weather.current.feelsLike) !== Math.round(weather.current.temp)) {
			return <Typography variant="caption">{`Feels Like ${Math.round(weather.current.feelsLike)}°`}</Typography>;
		}
		return null;
	}

	function renderMinMaxTemps(day) {
		return (
			<Typography variant="caption">
				<i className="icon-caret-up" />
				{`${Math.round(day ? day.maxTemp : weather.current.maxTemp)}° `}
				<i className="icon-caret-down" />
				{`${Math.round(day ? day.minTemp : weather.current.minTemp)}°`}
			</Typography>
		);
	}

	function renderWindDirection() {
		const rotation = { transform: `rotate(${weather.current.windDirection}deg)` };

		return (
			<Tooltip title="Wind Direction/Speed">
				<i className="icon-arrow-up" style={rotation} />
			</Tooltip>
		);
	}

	function renderWind() {
		return (
			<>
				<Typography variant="caption" className={classes.info}>
					<Tooltip title="Clouds">
						<i className="icon-clouds" />
					</Tooltip>
					{`${Math.round(weather.current.clouds)}%`}
				</Typography>
				<Typography variant="caption" className={classes.info}>
					{renderWindDirection()}
					{`${Math.round(weather.current.windSpeed)} m/s`}
				</Typography>
			</>
		);
	}

	function renderSun(oneByOne) {
		return (
			<>
				<Typography variant="caption" className={classes.info}>
					<Tooltip title="Sunrise">
						<i className="icon-sunrise" />
					</Tooltip>
					{`${weather.current.sunrise}`}
				</Typography>
				<Typography variant="caption" className={classes.info} style={oneByOne && { marginLeft: 15 }}>
					<Tooltip title="Sunset">
						<i className="icon-sunset" />
					</Tooltip>
					{`${weather.current.sunset}`}
				</Typography>
			</>
		);
	}

	function renderNextDays() {
		const nextDays = weather.daily.slice(0, 4).map((day, i, { length }) => (
			<Box
				key={day.date}
				display="flex"
				alignItems="center"
				justifyContent="center"
				flexDirection="column"
				flexGrow={1}
				className={length - 1 === i ? classes.lastDay : null}
			>
				<Typography variant="caption">{formatDate(day.date, "ddd", false, "DD/MM/YYYY")}</Typography>
				<Tooltip title={day.forecast.description} placement="top">
					{<img src={day.forecast.image} alt="Forecast" />}
				</Tooltip>
				{renderMinMaxTemps(day)}
			</Box>
		));

		return nextDays;
	}

	function render1x1() {
		return (
			<Box display="flex" flexDirection="column" flexGrow={1} className={classes.content}>
				<Box display="flex">
					<Box
						display="flex"
						flexDirection="column"
						justifyContent="center"
						flexGrow={1}
						style={{ top: -5, position: "relative" }}
					>
						<Typography variant="h4">{`${Math.round(weather.current.temp)}°`}</Typography>
					</Box>
					<Box display="flex" flexDirection="column" alignItems="flex-end">
						{renderMinMaxTemps()}
					</Box>
				</Box>
				<Box display="flex" justifyContent="center" alignItems="center" style={{ top: -15, position: "relative" }}>
					<Tooltip title={`${city}, ${country}`}>
						{<img src={weather.current.forecast.image} alt="Forecast" />}
					</Tooltip>
				</Box>
				<Box display="flex" justifyContent="center" alignItems="center" style={{ top: -25, position: "relative" }}>
					{renderSun(true)}
				</Box>
			</Box>
		);
	}

	function render1x2() {
		return (
			<Box display="flex" flexDirection="column" flexGrow={1} className={classes.content}>
				<Box display="flex">
					<Box display="flex" flexDirection="column" justifyContent="center" flexGrow={1}>
						<Typography variant="h6">{`${city}, ${country}`}</Typography>
						<Typography variant="subtitle1" className={classes.description}>
							{weather.current.forecast.description}
						</Typography>
					</Box>
					<Box display="flex" flexDirection="column" alignItems="flex-end">
						<Typography variant="h4">{`${Math.round(weather.current.temp)}°`}</Typography>
						{renderMinMaxTemps()}
					</Box>
				</Box>
				<Box display="flex" flexGrow={1}>
					<Box display="flex" flexDirection="column" justifyContent="center" flexGrow={1}>
						{renderWind()}
					</Box>
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						style={{ top: -5, position: "relative" }}
					>
						{<img src={weather.current.forecast.image} alt="Forecast" />}
					</Box>
					<Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-end" flexGrow={1}>
						{renderSun()}
					</Box>
				</Box>
			</Box>
		);
	}

	function render2x2() {
		return (
			<>
				<Box display="flex" flexDirection="column" flexGrow={1} className={classes.content}>
					<Box display="flex">
						<Box display="flex" flexDirection="column" justifyContent="center" flexGrow={1}>
							<Typography variant="h6">{`${city}, ${country}`}</Typography>
							<Typography variant="subtitle1" className={classes.description}>
								{weather.current.forecast.description}
							</Typography>
						</Box>
						<Box display="flex" flexDirection="column" alignItems="flex-end">
							<Typography variant="h4">{`${Math.round(weather.current.temp)}°`}</Typography>
							{renderMinMaxTemps()}
							{showFeelsLike()}
						</Box>
					</Box>
					<Box display="flex" flexGrow={1}>
						<Box display="flex" flexDirection="column" justifyContent="center" flexGrow={1}>
							{renderWind()}
						</Box>
						<Box display="flex" justifyContent="center" alignItems="center">
							{<img src={weather.current.forecast.image} alt="Forecast" />}
						</Box>
						<Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-end" flexGrow={1}>
							{renderSun()}
						</Box>
					</Box>
				</Box>
				<Box display="flex" className={classes.nextDays}>
					{renderNextDays()}
				</Box>
			</>
		);
	}

	function renderWeatherWidget() {
		if (widgetDimensions.h === 2 && widgetDimensions.w >= 2) {
			return render2x2();
		} else if (widgetDimensions.h === 1 && widgetDimensions.w >= 2) {
			return render1x2();
		}

		return render1x1();
	}

	if (!open) return <Loading />;

	return (
		<Zoom in={open}>
			<Box className={classes.root}>{renderWeatherWidget()}</Box>
		</Zoom>
	);
}

Weather.propTypes = {
	city: PropTypes.string.isRequired,
	country: PropTypes.string.isRequired,
	lat: PropTypes.number.isRequired,
	lon: PropTypes.number.isRequired,
	widgetDimensions: PropTypes.object,
};

export default Weather;
