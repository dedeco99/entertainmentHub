import React, { Component } from "react";

class Search extends Component {
	state = {
		search: "",
	}

	getSearch(e) {
		e.preventDefault();

		this.props.getSearch(this.state.search);
	}

	render() {
		const { search } = this.props;

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
					{
						search && search.length > 0
							? (
								search.map((s, index) => {
									return (
										<div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3" key={s.id}>
											<div className="seriesSearch">
												<div className="centerContainer">
													<i
														id={index}
														className="addSeries icofont-ui-add icofont-3x"
														onClick={() => this.props.addSeries(index)}
													></i>
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
