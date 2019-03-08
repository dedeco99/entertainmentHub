import React from "react";
import { Link } from "react-router-dom";

import TVSeriesSummary from "./TVSeriesSummary";

const TVSeriesList = ({tvSeries}) => {
  return (
    <div className="tvseries-list">
      <div className="row">
        { tvSeries && tvSeries.map(tvSeries => {
          return (
            <Link to={"/tvseries/"+tvSeries.id} key={tvSeries.id}>
              <TVSeriesSummary tvSeries={tvSeries}/>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default TVSeriesList;
