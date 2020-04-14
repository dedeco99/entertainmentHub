import React, { Component } from "react";
import PropTypes from "prop-types";

import { addApp } from "../../api/auth";

class Apps extends Component {
	componentDidMount() {
		const { history } = this.props;
		const platform = history.location.pathname.split("/")[2];
		const code = history.location.search.split("code=")[1];

		addApp(platform, code);
	}

	render() {
		return (
			<div>{"Yap"}</div>
		);
	}
}

Apps.propTypes = {
	history: PropTypes.object.isRequired,
};

export default Apps;
