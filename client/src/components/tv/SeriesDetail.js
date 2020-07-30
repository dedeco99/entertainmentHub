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
	}

	componentDidMount() {
		const { series } = this.props;

		this.setState({ title: series.displayName });
	}

	handleChange(e) {
		this.setState({ [e.target.id]: e.target.value });
	}

	async handleSubmit(e) {
		e.preventDefault();

		const { series, editSeries } = this.props;
		const { title } = this.state;

		await editSeries(series._id, { displayName: title });
	}

	render() {
		const { title } = this.state;

		return (
			<Container maxWidth="xs">
				<h2>{"Series"}</h2>
				<form onSubmit={this.handleSubmit}>
					<Input
						id="title"
						type="text"
						label="Title"
						value={title}
						onChange={this.handleChange}
						margin="normal"
						variant="outlined"
						fullWidth
						required
					/>
					<br /><br />
					<Button
						type="submit"
						color="primary"
						variant="outlined"
						fullWidth
					>
						{"Edit"}
					</Button>
				</form>
			</Container>
		);
	}
}

SeriesDetail.propTypes = {
	series: PropTypes.object.isRequired,
	editSeries: PropTypes.func.isRequired,
};

export default SeriesDetail;
