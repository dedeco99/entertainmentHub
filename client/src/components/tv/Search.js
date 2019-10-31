import React, { Component } from "react";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import Input from "../.partials/Input";

import loading from "../../img/loading2.gif";
import placeholder from "../../img/noimage.png";

class Search extends Component {
	constructor() {
		super();
		this.state = {
			search: "",

			showLoader: false,
		};

		this.getSearch = this.getSearch.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	async getSearch() {
		this.setState({ showLoader: true });

		await this.props.getSearch(this.state.search);

		this.setState({ showLoader: false });
	}

	handleKeyPress(event) {
		if (event.key === "Enter") this.getSearch();
	}

	render() {
		const { search } = this.props;
		const { showLoader } = this.state;

		let seriesList = showLoader ? <div className="loading" align="center"><img src={loading} alt="Loading..." /></div> : null;
		if (search && search.length > 0) {
			seriesList = search.map((series, index) => {
				return (
					<Grid
						item xs={12} sm={6} md={4} lg={4} xl={3}
						key={`${series.seriesId}${series.season}${series.number}`}
					>
						<div className="add-series-container">
							<i
								id={index}
								className="add-series-icon icofont-ui-add icofont-3x"
								onClick={() => this.props.addSeries(index)}
							/>
							<img src={series.image.substr(series.image.length - 4) === "null" ? placeholder : series.image} width="100%" alt={series.displayName} />
						</div>
					</Grid>
				);
			});
		}

		return (
			<Container>
				<Input
					id="search"
					label="Search"
					value={this.state.search}
					onChange={e => this.setState({ search: e.target.value })}
					onKeyPress={this.handleKeyPress}
					margin="normal"
					variant="outlined"
					fullWidth
				/>
				<br />
				<Grid container spacing={2}>
					{seriesList}
				</Grid>
			</Container>
		);
	}
}

Search.propTypes = {
	search: PropTypes.array,
	getSearch: PropTypes.func,
	addSeries: PropTypes.func,
};

export default Search;