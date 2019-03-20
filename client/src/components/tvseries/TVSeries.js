import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

import { getSeasons, getSearch, addTVSeries } from "../../store/actions/tvSeriesActions";

import Sidebar from "../.partials/Sidebar";
import Seasons from "./Seasons";
import Search from "./Search";

import "../../css/TVSeries.css";

class TVSeries extends Component {
  getSeasons = (tvSeries) => {
    this.props.getSeasons(tvSeries, this.props.auth.uid);
    this.showComponent("seasons");
  }

  getSearch = (search) => {
    this.props.getSearch(search, this.props.auth.uid);
  }

  addTVSeries = (tvSeries) => {
    this.props.addTVSeries(tvSeries, this.props.auth.uid);
  }

  showComponent = (component) => {
    const components = ["seasons", "seriesSearch"];

    components.forEach(component => {
      document.getElementById(component).style.display = "none";
    })

    document.getElementById(component).style.display = "block";
  }

  render() {
    const { tvSeries, seasons, tvSeriesSearch } = this.props;

    return (
      <div className="tvSeries">
        <div className="row">
          <div className="col-sm-3 col-md-2 col-lg-2">
            <button type="button" className="btn btn-primary" onClick={ () => this.showComponent("seriesSearch") }>
              Add
            </button>
            <br/><br/>
            <Sidebar options={ tvSeries } idField="seriesId" getPosts={ this.getSeasons } />
          </div>
          <div className="col-sm-9 col-md-10 col-lg-10">
            <div id="seriesSearch">
              <Search tvSeriesSearch={ tvSeriesSearch } getSearch={ this.getSearch } addTVSeries={ this.addTVSeries } />
            </div>
            <div id="seasons">
              <Seasons seasons={ seasons } />
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
    seasons: state.tvSeries.seasons,
    tvSeriesSearch: state.tvSeries.tvSeriesSearch
  }
}

const mapDispatchToProps = (dispatch) => {
	return {
    getSeasons: (tvSeries, userId) => dispatch(getSeasons(tvSeries, userId)),
    getSearch: (search, userId) => dispatch(getSearch(search, userId)),
    addTVSeries: (tvSeries, userId) => dispatch(addTVSeries(tvSeries, userId))
	}
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{ collection: "tvSeries" }])
)(TVSeries);
