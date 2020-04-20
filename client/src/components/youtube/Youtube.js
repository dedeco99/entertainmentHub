import React, { Component } from "react";

import { getSubscriptions } from "../../api/youtube";

class Youtube extends Component {
	constructor() {
		super();

		this.state = {
			subscriptions: [],
		};
	}

	async componentDidMount() {
		await this.getSubscriptions();
	}

	async getSubscriptions() {
		const response = await getSubscriptions();

		if (response.data) {
			this.setState({ subscriptions: response.data });
		}
	}

	render() {
		const { subscriptions } = this.state;

		return (
			<ul>
				{subscriptions.map(channel => (
					<li key={channel.channelId}>
						<img src={channel.logo} width="50px" alt={channel.title} />
						{channel.displayName}
					</li>
				))}
			</ul>
		);
	}
}

export default Youtube;
