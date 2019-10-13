import React, { Component } from "react";
import PropTypes from "prop-types";

class Search extends Component {
	constructor() {
		super();
		this.state = {
			search: "",
		};

		this.getSearch = this.getSearch.bind(this);
	}

	getSearch(e) {
		e.preventDefault();

		this.props.getSearch(this.state.search);
	}

	render() {
		const { search } = this.props;

		let episodeList = <div className="col-12"><div align="center">No series</div></div>;
		if (search && search.length > 0) {
			episodeList = search.map((series, index) => {
				return (
					<div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3" key={series.id}>
						<div className="seriesSearch">
							<div className="centerContainer">
								<i
									id={index}
									className="addSeries icofont-ui-add icofont-3x"
									onClick={() => this.props.addSeries(index)}
								></i>
								<img src={series.image} width="100%" alt={series.displayName} />
							</div>
							{series.displayName}
						</div>
					</div>
				);
			});
		}

		return (
			<div className="search">
				<form onSubmit={(e) => this.getSearch(e)}>
					<input
						type="text"
						className="form-control"
						id="search"
						onChange={e => this.setState({ search: e.target.value })}
						placeholder="Search..."
					/>
				</form>
				<br />
				<div className="row">
					{episodeList}
				</div>
			</div>
		);
	}
}

Search.propTypes = {
	search: PropTypes.array,
	getSearch: PropTypes.func,
	addSeries: PropTypes.func,
};

export default Search;
