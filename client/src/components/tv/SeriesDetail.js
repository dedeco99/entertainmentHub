import React, { Component } from "react";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import Input from "../.partials/Input";

class SeriesDetail extends Component {
	constructor() {
		super();
		this.state = {
			title: "",
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	componentDidMount() {
		const { series } = this.props;

		this.setState({ title: series.displayName });
	}

	handleChange(e) {
		this.setState({ [e.target.id]: e.target.value });
	}

	async handleSubmit() {
		const { series, editSeries } = this.props;
		const { title } = this.state;

		await editSeries(series.seriesId, { displayName: title });
	}

	handleKeyPress(event) {
		if (event.key === "Enter") this.handleSubmit();
	}

	render() {
		const { title } = this.state;

		return (
			<Container maxWidth="xs">
				<h2>{"Series"}</h2>
				<Input
					id="title"
					type="text"
					label="Title"
					value={title}
					onChange={this.handleChange}
					onKeyPress={this.handleKeyPress}
					margin="normal"
					variant="outlined"
					fullWidth
					required
				/>
				<br /><br />
				<Button
					onClick={this.handleSubmit}
					className="outlined-button"
					variant="outlined"
					fullWidth
				>
					{"Add"}
				</Button>
			</Container>
		);
	}
}

SeriesDetail.propTypes = {
	series: PropTypes.object,
	editSeries: PropTypes.func,
};

export default SeriesDetail;
