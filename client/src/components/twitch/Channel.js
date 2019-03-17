import React from "react";

import "../../css/Youtube.css";
import play from "../../img/play.png";

const Stream = ({ stream }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <a href={ "https://youtu.be/" + stream.videoId } target="_blank" rel="noopener noreferrer">{ stream.streamName }</a>
          <div className="streamName">{ stream.displayName }</div>
        </div>
      </div>
      <div className="card-body">
        <div className="centerContainer">
          <img className="youtubeVideo" id={ stream.videoId } src={ play } alt="Play" />
          <img src={ stream.preview } width="100%" alt="Thumbnail" />
        </div>
      </div>
      <div className="card-footer text-muted">
        <div>{ stream.viewers } viewers</div>
        <div>{ stream.game }</div>
      </div>
    </div>
  );
}

export default Stream;
