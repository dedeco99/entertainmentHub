import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";

import Sidebar from "../.partials/Sidebar";

import { YoutubeContext } from "../../contexts/YoutubeContext";
import { TwitchContext } from "../../contexts/TwitchContext";

import { getChannels, deleteChannel } from "../../api/channels";

function Channels({ platform }) {
	const { state, dispatch } = useContext(platform === "youtube" ? YoutubeContext : TwitchContext);
	const { channels } = state;

	useEffect(() => {
		async function fetchData() {
			const response = await getChannels(platform);

			if (response.data && response.data.length) {
				dispatch({ type: "SET_CHANNELS", channels: response.data });
			}
		}

		fetchData();
	}, []); // eslint-disable-line

	async function deleteChannelCall(e) {
		const response = await deleteChannel(e.target.id);

		if (response.status < 400) {
			dispatch({ type: "DELETE_CHANNEL", channel: response.data });
		}
	}

	const menuOptions = [{ displayName: "Delete", onClick: deleteChannelCall }];

	return (
		<Sidebar
			options={channels}
			idField="_id"
			menu={menuOptions}
			noResultsMessage={"No channels"}
		/>
	);
}

Channels.propTypes = {
	platform: PropTypes.string.isRequired,
};

export default Channels;
