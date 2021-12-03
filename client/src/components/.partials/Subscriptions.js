import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import Sidebar from "./Sidebar";
import DeleteConfirmation from "./DeleteConfirmation";

import { SubscriptionContext } from "../../contexts/SubscriptionContext";

import { getSubscriptions, deleteSubscription } from "../../api/subscriptions";

import { chooseContext } from "../../utils/utils";
import { translate } from "../../utils/translations";

function Subscriptions({ platform, selected, idField, countField, action }) {
	const { dispatch: subscriptionDispatch } = useContext(SubscriptionContext);
	const { state, dispatch } = useContext(chooseContext(platform));
	const { follows, subscriptions } = state;
	const [selectedSubscription, setSelectedSubscription] = useState(null);
	const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
	const [archive, setArchive] = useState(true);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			setLoading(true);

			const response = await getSubscriptions(platform);

			if (response.status === 200 && isMounted) {
				dispatch({ type: "SET_SUBSCRIPTIONS", subscriptions: response.data });

				setLoading(false);
			}
		}

		fetchData();

		return () => (isMounted = false);
	}, []);

	useEffect(() => {
		const uniqueGroups = [];

		for (const subscription of subscriptions) {
			subscription.group = subscription.group ? subscription.group : { name: "Ungrouped", pos: 0 };

			if (!uniqueGroups.find(group => group.name === subscription.group.name)) {
				uniqueGroups.push(subscription.group);
			}
		}

		subscriptionDispatch({ type: "SET_GROUPS", groups: uniqueGroups });
	}, [subscriptions]);

	async function handleDeleteSubscription() {
		const response = await deleteSubscription(selectedSubscription._id, archive);

		if (response.status === 200) {
			dispatch({ type: "DELETE_SUBSCRIPTION", subscription: response.data });

			handleCloseDeleteConfirmation();
		}
	}

	function handleShowModal(e, type) {
		const subscription =
			type === "edit"
				? subscriptions.find(s => s[idField] === e.target.id)
				: follows.find(s => s.externalId.toString() === e.target.id);

		setSelectedSubscription(subscription);

		subscriptionDispatch({ type: "SET_SUBSCRIPTION", subscription });
		subscriptionDispatch({ type: "SET_IS_NOTIFICATION", isNotification: false });
		subscriptionDispatch({ type: "SET_OPEN", open: true });
	}

	function handleOpenDeleteConfirmation(e, archive) {
		setSelectedSubscription(subscriptions.find(s => s[idField] === e.target.id));

		setArchive(archive);
		setOpenDeleteConfirmation(true);
	}

	function handleCloseDeleteConfirmation() {
		setOpenDeleteConfirmation(false);
	}

	const menuOptions = [
		{ displayName: translate("edit"), onClick: e => handleShowModal(e, "edit") },
		{ displayName: translate("delete"), onClick: e => handleOpenDeleteConfirmation(e, false) },
		{ displayName: translate("archive"), onClick: e => handleOpenDeleteConfirmation(e, true) },
	];

	return (
		<>
			<Sidebar
				options={subscriptions}
				platform={platform}
				selected={selected}
				idField={idField}
				countField={countField}
				action={action}
				menu={menuOptions}
				loading={loading}
				noResultsMessage={translate("noSubscriptions")}
			/>
			<DeleteConfirmation
				open={openDeleteConfirmation}
				onClose={handleCloseDeleteConfirmation}
				onDelete={handleDeleteSubscription}
				type={selectedSubscription && selectedSubscription.displayName}
			/>
		</>
	);
}

Subscriptions.propTypes = {
	platform: PropTypes.string.isRequired,
	selected: PropTypes.string,
	idField: PropTypes.string,
	countField: PropTypes.string,
	action: PropTypes.func.isRequired,
};

Subscriptions.defaultProps = {
	idField: "_id",
};

export default Subscriptions;
