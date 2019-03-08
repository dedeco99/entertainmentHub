import React from 'react';

import TVSeriesSummary from "./TVSeriesSummary";

const TVSeriesList = ({tvSeries}) => {
  return (
    <div className="tvseries-list">
      <div className="row">
        { tvSeries && tvSeries.map(tvSeries => {
          return (
            <TVSeriesSummary tvSeries={tvSeries} key={tvSeries.id}/>
          )
        })}
      </div>
    </div>
  )
}

export default TVSeriesList;
