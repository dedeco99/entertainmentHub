import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Zoom from "@material-ui/core/Zoom";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";

import { getWeather } from "../../actions/weather";

const styles = () => ({
	root: {
		backgroundColor: "#212121dd",
	},
});

class Weather extends Component {
	constructor() {
		super();
		this.state = {
			weather: null,

			open: false,
		};
	}

	componentDidMount() {
		this.getWeather();
	}

	async getWeather() {
		const response = await getWeather(38.5767759, -9.1566862);

		this.setState({ open: true, weather: response.data });
	}

	render() {
		const { classes } = this.props;
		const { weather, open } = this.state;

		return (
			<Zoom in={open}>
				<Card className={classes.root}>
					<CardActionArea>
						{weather && `${weather.current.temp} (${weather.current.minTemp} - ${weather.current.maxTemp})`}
						<br />
						{weather && weather.current.forecast.description}
						<br />
						{weather && <img src={weather.current.forecast.image} />}
					</CardActionArea>
				</Card>
			</Zoom>
		);
	}
}

Weather.propTypes = {
	classes: PropTypes.object,
};

export default withStyles(styles)(Weather);
