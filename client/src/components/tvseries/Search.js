import React, { Component } from "react";

class Search extends Component {
  state = {
    search: ""
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  searchSeries = (e) => {
    e.preventDefault();
    this.props.getSearch(this.state);
  }

  addSeries = (e) => {
    e.preventDefault();
    this.props.addTVSeries(e.target.id);
  }

  render() {
    const { tvSeriesSearch } = this.props;

    const tvSeriesSearchList = tvSeriesSearch && tvSeriesSearch.length > 0 ? (
  		tvSeriesSearch.map(series => {
  			return (
  				<div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3" key={ series.id }>
            <div className="seriesSearch">
              <div className="centerContainer">
                <i id={ JSON.stringify(series) } className="addSeries icofont-ui-add icofont-3x" onClick={ this.addSeries }></i>
    						<img src={ series.image } width="100%" alt={ series.displayName } />
              </div>
              { series.displayName }
            </div>
  				</div>
  			)
  		})
  	) : (
  		<div className="col-12">
  			<div align="center">No results</div>
  		</div>
  	)

    return (
      <div className="search">
        <form onSubmit={ this.searchSeries }>
          <input type="text" className="form-control" id="search" onChange={ this.handleChange } placeholder="Search..." />
        </form>
        <br />
        <div className="row">
          { tvSeriesSearchList }
        </div>
      </div>
    )
  }
}

export default Search;
