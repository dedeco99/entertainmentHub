import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Scrollbars } from "react-custom-scrollbars";

import { UserContext } from "../../contexts/UserContext";

function CustomScrollbar({ children }) {
	const { user } = useContext(UserContext);

	function renderThumb({ style, ...props }) {
		const thumbStyle = { backgroundColor: "#212121", width: 8 };

		return <div style={{ ...style, ...thumbStyle }} {...props} />;
	}

	function renderTrack({ style, ...props }) {
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

	if (!user.settings || !user.settings.useCustomScrollbar) return <div style={{ width: "100%" }}>{children}</div>;

	return (
		<Scrollbars renderThumbVertical={renderThumb} renderTrackVertical={renderTrack}>
			{children}
		</Scrollbars>
	);
}

CustomScrollbar.propTypes = {
	children: PropTypes.node.isRequired,
};

export default CustomScrollbar;
