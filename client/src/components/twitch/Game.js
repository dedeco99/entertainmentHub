import React from "react";

const Game = ({ game, getStreamsForGame }) => {
  const getGame = (e) => {
    getStreamsForGame(e.target.id);
  }

  return (
    <div className="game">
      <img src={ game.logo } id={ game.name } onClick={ getGame } width="100%" alt="Logo" />
    </div>
  );
}

export default Game;
