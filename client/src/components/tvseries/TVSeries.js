import React, { Component } from 'react';
import { connect } from 'react-redux'
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

import TVSeriesList from "./TVSeriesList";
import AddTVSeries from "./AddTVSeries";

class TVSeries extends Component {
  render() {
    const { tvSeries } = this.props;

    return (
      <div className="TVSeries container">
        <TVSeriesList tvSeries={tvSeries} />
        <AddTVSeries/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    tvSeries: state.firestore.ordered.tvseries
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "tvseries" }])
)(TVSeries);
