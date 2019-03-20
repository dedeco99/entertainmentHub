import React, { Component } from "react";
import { connect } from "react-redux";

import { getGames, getStreamsForGame, getStreams, getChannels } from "../../store/actions/twitchActions";

import Categories from "../.partials/Categories";
import Games from "./Games";
import Streams from "./Streams";
import Channels from "./Channels";

import "../../css/Twitch.css";

class Twitch extends Component {
  componentDidMount() {
    this.props.getStreams(this.props.auth.uid);
  }

  showComponent = (component) => {
    const components = ["gamesBlock", "streamsForGameBlock", "streamsBlock", "channelsBlock"];

    components.forEach(component => {
      document.getElementById(component).style.display = "none";
    })

    document.getElementById(component).style.display = "block";
  }

  getPosts = (action) => {
    console.log(action);
    if(action === "games"){
      this.getGames();
    }else if(action === "streams"){
      this.getStreams();
    }else if(action === "channels"){
      return;
    }
  }

  getGames = () => {
    this.props.getGames(this.props.auth.uid);
    this.showComponent("gamesBlock");
  }

  getStreamsForGame = (game) => {
    this.props.getStreamsForGame(game, this.props.auth.uid);
    this.showComponent("streamsForGameBlock");
  }

  getStreams = () => {
    this.props.getStreams(this.props.auth.uid);
    this.showComponent("streamsBlock");
  }

  render() {
    const { games, streamsForGame, streams, channels } = this.props;

    const categories = [
      {id: "games", displayName: "Games", path: "/twitch", active: false },
      {id: "streams", displayName: "Streams", path: "/twitch", active: true },
      {id: "channels", displayName: "Channels", path: "/twitch", active: false}
    ];

    return (
      <div className="twitch">
        <div className="row">
          <div className="col-12">
            <Categories
              options={ categories }
              action={ this.getPosts }
            />
            <br/>
            <div id="gamesBlock">
              <Games games={ games } getStreamsForGame={ this.getStreamsForGame } />
            </div>
            <div id="streamsForGameBlock">
              <Streams streams={ streamsForGame } />
            </div>
            <div id="streamsBlock">
              <Streams streams={ streams } />
            </div>
            <div id="channelsBlock">
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
