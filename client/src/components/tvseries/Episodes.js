import React from "react";

import Episode from "./Episode";

const Episodes = ({ episodes }) => {
  const episodesList = episodes && episodes.length > 0 ? (
		episodes.map(episode => {
      if(episode!=null)
			return (
        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3" key={ "" + episode.seriesId + episode.season + episode.number }>
						<Episode episode={ episode }/>
				</div>
			)
		})
	) : (
    <div className="col-12">
			<div align="center">No episodes</div>
		</div>
	);

  return (
    <div className="tvseries-list">
      <div className="row">
        { episodesList }
      </div>
    </div>
  )
}

export default Episodes;
