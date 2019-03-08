import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

const Seasons = ({series}) => {
	if(series){
	  return (
			<div className="seasons container section">
	      <div className="card z-depth-0">
	        <div className="card-content">
	          <span className="card-title">{series.title}</span>
	          <p>{series.seriesId}</p>
	        </div>
	        <div className="card-action grey lighten-4 grey-text">
	          <div>Posted by {series.user}</div>
	          <div>2nd September, 2am</div>
	        </div>
	      </div>
	    </div>
	  )
	}else{
		return(
			<div className="container center">
				Loading...
			</div>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = ownProps.match.params.id;
	const tvSeries = state.firestore.data.tvseries;
	const series = tvSeries ? tvSeries[id] : null;

	return {
		series: series
	}
}

export default compose(
	connect(mapStateToProps),
	firestoreConnect([{ collection: "tvseries" }])
)(Seasons);
