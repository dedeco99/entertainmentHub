import React, { Component } from "react";
import PropTypes from "prop-types";

import { Scrollbars } from "react-custom-scrollbars";

class CustomScrollbar extends Component {
	renderThumb({ style, ...props }) {
		const thumbStyle = { backgroundColor: "#212121", width: 8 };
		return <div style={{ ...style, ...thumbStyle }} {...props} />;
	}

	renderTrack({ style, ...props }) {
		const trackStyle = {
			top: 0,
			right: 0,
			width: 10,
			border: "1px solid #ddd",
			height: "100%",
			backgroundColor: "#ddd",
			boxSizing: "border-box",
		};
		return <div style={{ ...style, ...trackStyle }} {...props} />;
	}

	render() {
		const { children } = this.props;

		return (
			<Scrollbars
				renderThumbVertical={this.renderThumb}
				renderTrackVertical={this.renderTrack}
			>
				{ children }
			</Scrollbars>
		);
	}
}

CustomScrollbar.propTypes = {
	children: PropTypes.element.isRequired,
};

export default CustomScrollbar;
