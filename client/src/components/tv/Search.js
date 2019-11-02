import React, { Component } from "react";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";

import Input from "../.partials/Input";
import SeriesDetail from "./SeriesDetail";

import loading from "../../img/loading2.gif";
import placeholder from "../../img/noimage.png";

class Search extends Component {
	constructor() {
		super();
		this.state = {
			query: "",

			currentSeries: null,
			showLoader: false,
			showModal: false,
		};

		this.getSearch = this.getSearch.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleModalOpen = this.handleModalOpen.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleModalClose = this.handleModalClose.bind(this);
	}

	async getSearch() {
		const { getSearch } = this.props;
		const { query } = this.state;

		this.setState({ showLoader: true });

		await getSearch(query);

		this.setState({ showLoader: false });
	}

	handleSearch(e) {
		this.setState({ query: e.target.value });
	}

	handleKeyPress(event) {
		if (event.key === "Enter") this.getSearch();
	}

	handleModalOpen(e) {
		const { search } = this.props;
		this.setState({ currentSeries: search[e.target.id], showModal: true });
	}

	handleModalClose() {
		this.setState({ showModal: false });
	}

	render() {
		const { search, addSeries } = this.props;
		const { query, currentSeries, showLoader, showModal } = this.state;

		let seriesList = showLoader ? <div className="loading" align="center"><img src={loading} alt="Loading..." /></div> : null;
		if (search && search.length > 0) {
			seriesList = search.map((series, index) => (
				<Grid
					item xs={12} sm={6} md={4} lg={4} xl={3}
					key={series.id}
				>
					<div className="add-series-container">
						<i
							id={index}
							className="add-series-icon icofont-ui-add icofont-3x"
							onClick={this.handleModalOpen}
						/>
						<img src={series.image.substr(series.image.length - 4) === "null" ? placeholder : series.image} width="100%" alt={series.displayName} />
					</div>
				</Grid>
			));
		}

		return (
			<Container>
				<Input
					id="search"
					label="Search"
					value={query}
					onChange={this.handleSearch}
					onKeyPress={this.handleKeyPress}
					margin="normal"
					variant="outlined"
					fullWidth
				/>
				<br />
				<Grid container spacing={2}>
					{seriesList}
					<Modal
						open={showModal}
						onClose={this.handleModalClose}
					>
						<SeriesDetail addSeries={addSeries} series={currentSeries} />
					</Modal>
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
