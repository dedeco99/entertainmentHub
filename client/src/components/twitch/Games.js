import React from "react";

import Game from "./Game";

import loading from "../../img/loading.gif";

const Games = ({ games, getStreamsForGame }) => {
	const followedGamesList = [];
	const gamesList = games.length>0 ? (
		games.map(game => {
			if(game.followed){
				followedGamesList.push(
					<div className="col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2" key={ game.id }>
							<Game game={ game } getStreamsForGame={ getStreamsForGame } />
					</div>
				);
			}else{
				return (
					<div className="col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2" key={ game.id }>
							<Game game={ game } getStreamsForGame={ getStreamsForGame } />
					</div>
				)
			}
		})
	) : (
		<div className="loading">
			<img src={ loading } width="200px" alt="Loading..."/>
		</div>
	)

  return (
    <div className="Games">
			<div className="row">
				{ followedGamesList }
			</div>
			<hr />
			<div className="row">
      	{ gamesList }
			</div>
    </div>
  );
}

export default Games;
