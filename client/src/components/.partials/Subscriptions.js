import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";

import Sidebar from "../.partials/Sidebar";

import { YoutubeContext } from "../../contexts/YoutubeContext";
import { TwitchContext } from "../../contexts/TwitchContext";

import { getSubscriptions, deleteSubscription } from "../../api/subscriptions";

function Subscriptions({ platform }) {
	const { state, dispatch } = useContext(platform === "youtube" ? YoutubeContext : TwitchContext);
	const { subscriptions } = state;

	useEffect(() => {
		async function fetchData() {
			const response = await getSubscriptions(platform);

			if (response.status === 200) {
				dispatch({ type: "SET_SUBSCRIPTIONS", subscriptions: response.data });
			}
		}

		fetchData();
	}, []); // eslint-disable-line

	async function handleDeleteSubscription(e) {
		const response = await deleteSubscription(e.target.id);

		if (response.status === 200) {
			dispatch({ type: "DELETE_SUBSCRIPTION", subscription: response.data });
		}
	}

	const menuOptions = [{ displayName: "Delete", onClick: handleDeleteSubscription }];

	return (
		<Sidebar options={subscriptions} idField="_id" menu={menuOptions} noResultsMessage={"No subscriptions"} />
	);
}

Subscriptions.propTypes = {
	platform: PropTypes.string.isRequired,
};

export default Subscriptions;
