import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import Sidebar from "./Sidebar";
import SubscriptionDetail from "./SubscriptionDetail";

import { YoutubeContext } from "../../contexts/YoutubeContext";
import { TwitchContext } from "../../contexts/TwitchContext";
import { TVContext } from "../../contexts/TVContext";

import { getSubscriptions, deleteSubscription } from "../../api/subscriptions";

import { translate } from "../../utils/translations";

function chooseContext(platform) {
	switch (platform) {
		case "youtube":
			return YoutubeContext;
		case "twitch":
			return TwitchContext;
		case "tv":
			return TVContext;
		default:
			break;
	}
}

function Subscriptions({ platform, selected, idField, action }) {
	const { state, dispatch } = useContext(chooseContext(platform));
	const { follows, subscriptions } = state;
	const [selectedSubscription, setSelectedSubscription] = useState(null);
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			const response = await getSubscriptions(platform);

			if (response.status === 200 && isMounted) {
				dispatch({ type: "SET_SUBSCRIPTIONS", subscriptions: response.data });
			}
		}

		fetchData();

		return () => (isMounted = false);
	}, []); // eslint-disable-line

	async function handleEditSubscription(id, subscription) {
		const response = await editSubscription(id, subscription);

		if (response.status === 200) {
			dispatch({ type: "EDIT_SUBSCRIPTION", subscription: response.data });
		}
	}

	async function handleDeleteSubscription(e) {
		let id = e.target.id;
		if (idField !== "_id") {
			id = subscriptions.find(s => s[idField] === id)._id;
		}

		const response = await deleteSubscription(id);

		if (response.status === 200) {
			dispatch({ type: "DELETE_SUBSCRIPTION", subscription: response.data });
		}
	}

	function handleShowModal(e, type) {
		if (type === "edit") {
			setSelectedSubscription(subscriptions.find(s => s[idField] === e.target.id));
		} else {
			const found = follows.find(s => s.externalId.toString() === e.target.id);

			setSelectedSubscription(found);
		}

		setOpenModal(true);
	}

	function handleHideModal() {
		setOpenModal(false);
	}

	const menuOptions = [
		{ displayName: translate("edit"), onClick: e => handleShowModal(e, "edit") },
		{ displayName: translate("delete"), onClick: handleDeleteSubscription },
	];

	return (
		<>
			<Sidebar
				options={subscriptions}
				selected={selected}
				idField={idField}
				action={action}
				menu={menuOptions}
				noResultsMessage={"No subscriptions"}
			/>
			<SubscriptionDetail
				open={openModal}
				subscription={selectedSubscription}
				editSubscription={handleEditSubscription}
				onClose={handleHideModal}
			/>
		</>
	);
}

Subscriptions.propTypes = {
	platform: PropTypes.string.isRequired,
	selected: PropTypes.string,
	idField: PropTypes.string,
	action: PropTypes.func.isRequired,
};

Subscriptions.defaultProps = {
	idField: "_id",
};

export default Subscriptions;
