import React, { Component } from "react";
import { connect } from "react-redux";

import { getChannels, getStreams } from "../../store/actions/twitchActions";

import Sidebar from "../.partials/Sidebar";
import Categories from "./Categories";
import Streams from "./Streams";

class Twitch extends Component {
  componentDidMount() {
    this.props.getStreams(this.props.auth.uid);
  }

  getStreams = () => {
    this.props.getStreams(this.props.auth.uid)
  }

  render() {
    const { channels, streams } = this.props;

    return (
      <div className="twitch">
        <div className="row">
          <div className="col-12">
            <Categories
              getStreams = { this.getStreams }
              getChannels = { this.getStreams }
            />
            <br/>
            <Streams streams={ streams } />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    channels: state.twitch.channels,
    streams: state.twitch.streams
  }
}

const mapDispatchToProps = (dispatch) => {
	return {
    getChannels: (userId) => dispatch(getChannels(userId)),
		getStreams: (userId) => dispatch(getStreams(userId))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Twitch);
