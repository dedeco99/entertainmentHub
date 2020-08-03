import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles, Zoom, Typography, Box, Tooltip } from "@material-ui/core";

import Loading from "../.partials/Loading";

import { getWeather } from "../../api/weather";

import { formatDate } from "../../utils/utils";

import { weather as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function Weather({ city, country, lat, lon }) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [weather, setWeather] = useState(false);

	useEffect(() => {
		async function fetchData() {
			setOpen(false);

			const response = await getWeather(lat, lon);

			setWeather(response.data);
			setOpen(true);
		}

		fetchData();
	}, [city, country, lat, lon]); // eslint-disable-line

	function showFeelsLike() {
		if (Math.round(weather.current.feelsLike) !== Math.round(weather.current.temp)) {
			return <Typography variant="caption">{`Feels Like ${Math.round(weather.current.feelsLike)}°`}</Typography>;
		}
		return null;
	}

	function renderWindDirection() {
		const rotation = { transform: `rotate(${weather.current.windDirection}deg)` };

		return (
			<Tooltip title="Wind Direction/Speed">
				<i className="icofont-arrow-up" style={rotation} />
			</Tooltip>
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
				<Typography variant="caption">
					<i className="icofont-caret-up" />
					{`${Math.round(day.maxTemp)}° `}
					<i className="icofont-caret-down" />
					{`${Math.round(day.minTemp)}°`}
				</Typography>
			</Box>
		));

		return nextDays;
	}

	if (!open) return <Loading />;

	return (
		<Zoom in={open}>
			<Box className={classes.root}>
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
							<Typography variant="caption">
								<i className="icofont-caret-up" />
								{`${Math.round(weather.current.maxTemp)}° `}
								<i className="icofont-caret-down" />
								{`${Math.round(weather.current.minTemp)}°`}
							</Typography>
							{showFeelsLike()}
						</Box>
					</Box>
					<Box display="flex" flexGrow={1}>
						<Box display="flex" flexDirection="column" justifyContent="center" flexGrow={1}>
							<Typography variant="caption" className={classes.info}>
								<Tooltip title="Clouds">
									<i className="icofont-clouds" />
								</Tooltip>
								{`${Math.round(weather.current.clouds)}%`}
							</Typography>
							<Typography variant="caption" className={classes.info}>
								{renderWindDirection()}
								{`${Math.round(weather.current.windSpeed)} m/s`}
							</Typography>
						</Box>
						<Box display="flex" justifyContent="center" alignItems="center">
							{<img src={weather.current.forecast.image} alt="Forecast" />}
						</Box>
						<Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-end" flexGrow={1}>
							<Typography variant="caption" className={classes.info}>
								<Tooltip title="Sunrise">
									<i className="icofont-sun-rise" />
								</Tooltip>
								{`${weather.current.sunrise}`}
							</Typography>
							<Typography variant="caption" className={classes.info}>
								<Tooltip title="Sunset">
									<i className="icofont-sun-set" />
								</Tooltip>
								{`${weather.current.sunset}`}
							</Typography>
						</Box>
					</Box>
				</Box>
				<Box display="flex" className={classes.nextDays}>
					{renderNextDays()}
				</Box>
			</Box>
		</Zoom>
	);
}

Weather.propTypes = {
	city: PropTypes.string.isRequired,
	country: PropTypes.string.isRequired,
	lat: PropTypes.number.isRequired,
	lon: PropTypes.number.isRequired,
};

export default Weather;
