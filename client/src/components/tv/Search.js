import React, { Component } from "react";

import { getSearch, addSeries } from "../../actions/tv";

class Search extends Component {
	state = {
		search: "",
		series: [],
	}

	getSearch = async (e) => {
		e.preventDefault();

		const response = await getSearch(this.state.search);
		this.setState({ series: response.data });
	}

	addSeries = (e) => {
		e.preventDefault();

		addSeries(this.state.series[e.target.id]);
	}

	render() {
		const { search, series } = this.state;

		return (
			<div className="search">
				<form onSubmit={this.getSearch}>
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
					{
						series && series.length > 0
							? (
								series.map((s, index) => {
									return (
										<div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3" key={s.id}>
											<div className="seriesSearch">
												<div className="centerContainer">
													<i id={index} className="addSeries icofont-ui-add icofont-3x" onClick={this.addSeries}></i>
													<img src={s.image} width="100%" alt={s.displayName} />
												</div>
												{s.displayName}
											</div>
										</div>
									)
								})
							) : (
								<div className="col-12">
									<div align="center">No results</div>
								</div>
							)
					}
				</div>
			</div>
		)
	}
}

export default Search;
