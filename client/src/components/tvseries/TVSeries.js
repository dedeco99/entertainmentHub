import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

import { getSearch, addTVSeries } from "../../store/actions/tvSeriesActions";

import Sidebar from "../.partials/Sidebar";
import Search from "./Search";

import "../../css/TVSeries.css";

class TVSeries extends Component {
  getSearch = (search) => {
    this.props.getSearch(search, this.props.auth.uid)
  }

  addTVSeries = (tvSeries) => {
    this.props.addTVSeries(tvSeries, this.props.auth.uid)
  }

  showComponent = (component) => {
    const components = ["seriesSearch"];

    components.forEach(component => {
      document.getElementById(component).style.display = "none";
    })

    document.getElementById(component).style.display = "block";
  }

  render() {
    const { tvSeries, tvSeriesSearch } = this.props;

    return (
      <div className="tvSeries">
        <div className="row">
          <div className="col-sm-3 col-md-2 col-lg-2">
            <button type="button" className="btn btn-primary" onClick={ () => this.showComponent("seriesSearch") }>
              Add
            </button>
            <Sidebar options={ tvSeries } getSeasons={ this.getSeasons } />
          </div>
          <div className="col-sm-9 col-md-10 col-lg-10">
            <div id="seriesSearch">
              <Search tvSeriesSearch={ tvSeriesSearch } getSearch={ this.getSearch } addTVSeries={ this.addTVSeries } />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    tvSeries: state.firestore.ordered.tvSeries,
    tvSeriesSearch: state.tvSeries.tvSeriesSearch
  }
}

const mapDispatchToProps = (dispatch) => {
	return {
    getSearch: (search, userId) => dispatch(getSearch(search, userId)),
    addTVSeries: (series, userId) => dispatch(addTVSeries(series, userId))
	}
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{ collection: "tvSeries" }])
)(TVSeries);
