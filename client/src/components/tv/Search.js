import React, { Component } from "react";
import PropTypes from "prop-types";
import InputAdornment from "@material-ui/core/InputAdornment";

import { getSearch } from "../../api/tv";

import Input from "../.partials/Input";
import Banners from "./Banners";

import loadingGif from "../../img/loading3.gif";

class Search extends Component {
	constructor() {
		super();
		this.state = {
			search: [],
			query: "",
			page: 0,
			hasMore: false,
			loading: false,
		};

		this.getSearch = this.getSearch.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async getSearch() {
		const { search, query, page, loading } = this.state;

		if (!loading) {
			this.setState({ loading: true });

			const response = await getSearch(query, page);

			const newSearch = page === 0 ? response.data : search.concat(response.data);

			this.setState({
				search: newSearch,
				page: page + 1,
				hasMore: !(response.data.length < 20),
				loading: false,
			});
		}
	}

	handleSearch(e) {
		this.setState({ query: e.target.value, page: 0 });
	}

	handleSubmit(e) {
		e.preventDefault();

		this.getSearch();
	}

	render() {
		const { allSeries, addSeries } = this.props;
		const { search, query, hasMore, loading } = this.state;

		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<Input
						id="search"
						label="Search"
						value={query}
						onChange={this.handleSearch}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									{loading ? <img src={loadingGif} height="25px" alt="Loading..." /> : <div />}
								</InputAdornment>
							),
						}}
						margin="normal"
						variant="outlined"
						fullWidth
					/>
				</form>
				<Banners
					series={search}
					getMore={this.getSearch}
					hasMore={hasMore}
					allSeries={allSeries}
					addSeries={addSeries}
				/>
			</div>
		);
	}
}

Search.propTypes = {
	allSeries: PropTypes.array.isRequired,
	addSeries: PropTypes.func.isRequired,
};

export default Search;
