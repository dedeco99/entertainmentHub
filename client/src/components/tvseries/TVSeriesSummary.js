import React from 'react';

const TVSeriesSummary = ({tvSeries}) => {
  return (
    <div className="col s6 m4">
  		<div className="card z-depth-0 project-summary">
  			<div className="card-content grey-text text-darken-3">
  				<span className="card-title ">{tvSeries.title}</span>
  				<p>{tvSeries.seriesId}</p>
  			</div>
  		</div>
    </div>
	)
}

export default TVSeriesSummary;
