import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Zoom from "@material-ui/core/Zoom";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";

import moment from "moment";

import { getWeather } from "../../actions/weather";

const styles = () => ({
	root: {
		display: "flex",
		flexDirection: "column",
		backgroundColor: "#212121dd",
		height: "100%",
		boxSizing: "border-box",
	},
	content: {
		padding: 16,
		paddingBottom: 0,
	},
	description: {
		textTransform: "capitalize",
	},
	info: {
		"display": "flex",
		"alignItems": "center",
		"& i": {
			fontSize: "1.5rem",
			marginRight: 4,
			marginBottom: 5,
			display: "inline-block",
		},
	},
	nextDays: {
		"& div": {
			"borderTop": "1px solid #121212",
			"borderRight": "1px solid #121212",
			"padding": "5px 2px 5px 2px",
			"& img": {
				width: 40,
				height: 40,
			},
		},
	},
	lastDay: {
		borderRight: "none !important",
	},
});

class Weather extends Component {
	constructor() {
		super();
		this.state = {
			weather: null,
			loaded: false,
		};
	}

	componentDidMount() {
		this.getWeather();
	}

	async getWeather() {
		const { lat, lon } = this.props;

		const response = await getWeather(lat, lon);

		this.setState({ loaded: true, weather: response.data });
	}

	showFeelsLike() {
		const { weather } = this.state;

		if (Math.round(weather.current.feelsLike) !== Math.round(weather.current.temp)) {
			return (
				<Typography variant="caption">
					{weather && `Feels Like ${Math.round(weather.current.feelsLike)}°`}
				</Typography>
			);
		}
		return null;
	}

	renderWindDirection() {
		const { weather } = this.state;

		const rotation = { transform: `rotate(${weather.current.windDirection}deg)` };

		return (
			<Tooltip title="Wind Direction/Speed">
				<i className="icofont-arrow-up" style={rotation} />
			</Tooltip>
		);
	}

	renderNextDays() {
		const { classes } = this.props;
		const { weather } = this.state;

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
				<Typography variant="caption">
					{weather && moment(day.date, "DD/MM/YYYY").format("ddd")}
				</Typography>
				<Tooltip title={day.forecast.description} placement="top">
					{weather && <img src={day.forecast.image} alt="Forecast" />}
				</Tooltip>
				<Typography variant="caption">
					<i className="icofont-caret-up" />
					{weather && `${Math.round(day.maxTemp)}° `}
					<i className="icofont-caret-down" />
					{weather && `${Math.round(day.minTemp)}°`}
				</Typography>
			</Box>
		));

		return nextDays;
	}

	render() {
		const { classes, city, country } = this.props;
		const { weather, loaded } = this.state;

		return (
			<Zoom in={loaded}>
				<Card variant="outlined" className={classes.root}>
					<Box display="flex" flexDirection="column" flexGrow={1} className={classes.content}>
						<Box display="flex">
							<Box display="flex" flexDirection="column" justifyContent="center" flexGrow={1}>
								<Typography variant="h6">
									{`${city}, ${country}`}
								</Typography>
								<Typography variant="subtitle1" className={classes.description}>
									{weather && weather.current.forecast.description}
								</Typography>
							</Box>
							<Box display="flex" flexDirection="column" alignItems="flex-end">
								<Typography variant="h4">
									{weather && `${Math.round(weather.current.temp)}°`}
								</Typography>
								<Typography variant="caption">
									<i className="icofont-caret-up" />
									{weather && `${Math.round(weather.current.maxTemp)}° `}
									<i className="icofont-caret-down" />
									{weather && `${Math.round(weather.current.minTemp)}°`}
								</Typography>
								{weather && this.showFeelsLike()}
							</Box>
						</Box>
						<Box display="flex" flexGrow={1}>
							<Box display="flex" flexDirection="column" justifyContent="center" flexGrow={1}>
								<Typography variant="caption" className={classes.info}>
									<Tooltip title="Clouds">
										<i className="icofont-clouds" />
									</Tooltip>
									{weather && `${Math.round(weather.current.clouds)}%`}
								</Typography>
								<Typography variant="caption" className={classes.info}>
									{weather && this.renderWindDirection()}
									{weather && `${Math.round(weather.current.windSpeed)} m/s`}
								</Typography>
							</Box>
							<Box display="flex" justifyContent="center" alignItems="center">
								{weather && <img src={weather.current.forecast.image} alt="Forecast" />}
							</Box>
							<Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-end" flexGrow={1}>
								<Typography variant="caption" className={classes.info}>
									<Tooltip title="Sunrise">
										<i className="icofont-sun-rise" />
									</Tooltip>
									{weather && `${weather.current.sunrise}`}
								</Typography>
								<Typography variant="caption" className={classes.info}>
									<Tooltip title="Sunset">
										<i className="icofont-sun-set" />
									</Tooltip>
									{weather && `${weather.current.sunset}`}
								</Typography>
							</Box>
						</Box>
					</Box>
					<Box display="flex" className={classes.nextDays}>
						{weather && this.renderNextDays()}
					</Box>
				</Card>
			</Zoom>
		);
	}
}

Weather.propTypes = {
	classes: PropTypes.object.isRequired,
	city: PropTypes.string.isRequired,
	country: PropTypes.string.isRequired,
	lat: PropTypes.number.isRequired,
	lon: PropTypes.number.isRequired,
};

export default withStyles(styles)(Weather);
