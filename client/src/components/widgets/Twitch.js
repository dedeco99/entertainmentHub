import React, { Component } from "react";

import { getStreams } from "../../api/twitch";

class Twitch extends Component {
	constructor() {
		super();
		this.state = {
			streams: [],
		};
	}

	async componentDidMount() {
		console.log("gotem");
		await this.getStreams();
	}

	async getStreams() {
		const response = await getStreams();

		console.log(response);

		this.setState({ streams: response.data });
	}

	render() {
		const { streams } = this.state;

		return (
			<div>
				{streams.map(stream => <div key={stream.id}>{stream.title}</div>)}
			</div>
		);
	}
}

export default Twitch;
