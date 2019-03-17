import React, { Component } from "react";
import { connect } from "react-redux";

import { getGames, getStreamsForGame, getStreams, getChannels } from "../../store/actions/twitchActions";

import Categories from "./Categories";
import Games from "./Games";
import Streams from "./Streams";
import Channels from "./Channels";

import "../../css/Twitch.css";

class Twitch extends Component {
  componentDidMount() {
    this.props.getStreams(this.props.auth.uid);
  }

  showComponent = (component) => {
    const components = ["games", "streamsForGame", "streams", "channels"];

    components.forEach(component => {
      document.getElementById(component).style.display = "none";
    })

    document.getElementById(component).style.display = "block";
  }

  getGames = () => {
    this.props.getGames(this.props.auth.uid);
    this.showComponent("games");
  }

  getStreamsForGame = (game) => {
    this.props.getStreamsForGame(game, this.props.auth.uid);
    this.showComponent("streamsForGame");
  }

  getStreams = () => {
    this.props.getStreams(this.props.auth.uid);
    this.showComponent("streams");
  }

  render() {
    const { games, streamsForGame, streams, channels } = this.props;

    return (
      <div className="twitch">
        <div className="row">
          <div className="col-12">
            <Categories
              getGames={ this.getGames }
              getStreams={ this.getStreams }
              getChannels={ this.getChannels }
            />
            <br/>
            <div id="games">
              <Games games={ games } getStreamsForGame={ this.getStreamsForGame } />
            </div>
            <div id="streamsForGame">
              <Streams streams={ streamsForGame } />
            </div>
            <div id="streams">
              <Streams streams={ streams } />
            </div>
            <div id="channels">
              <Channels channels={ channels } />
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
    games: state.twitch.games,
    streamsForGame: state.twitch.streamsForGame,
    streams: state.twitch.streams,
    channels: state.twitch.channels
  }
}

const mapDispatchToProps = (dispatch) => {
	return {
    getGames: (userId) => dispatch(getGames(userId)),
    getStreamsForGame: (game, userId) => dispatch(getStreamsForGame(game, userId)),
    getStreams: (userId) => dispatch(getStreams(userId)),
    getChannels: (userId) => dispatch(getChannels(userId))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Twitch);
