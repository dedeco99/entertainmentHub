import React, { Component } from "react";

import { addApp } from "../../actions/auth";

class Apps extends Component {
	componentDidMount() {
		const platform = this.props.history.location.pathname.split("/")[2];
		const code = this.props.history.location.search.split("code=")[1];

		this.addApp(platform, code);
	}

	addApp = async (platform, code) => {
		addApp(platform, code);
	}

	render() {
		return (
			<div>Yap</div>
		);
	}
}

export default Apps;
