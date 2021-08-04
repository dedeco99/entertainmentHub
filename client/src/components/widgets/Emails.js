import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import parse from "html-react-parser";
import { enable as enableDarkReader, disable as disableDarkReader } from "darkreader";

import {
	Zoom,
	Box,
	Typography,
	ListItem,
	ListItemSecondaryAction,
	IconButton,
	Menu,
	MenuItem,
} from "@material-ui/core";

import Loading from "../.partials/Loading";
import AnimatedList from "../.partials/AnimatedList";
import SingleView from "../.partials/SingleView";

import { getEmails, getEmailLabels, editEmail, deleteEmail } from "../../api/emails";

import { formatDate } from "../../utils/utils";
import { translate } from "../../utils/translations";

function Emails() {
	const [emails, setEmails] = useState([]);
	const [labels, setLabels] = useState([]);
	const [showListView, setShowListView] = useState(true);
	const [selectedEmail, setSelectedEmail] = useState(null);
	const [emailAnchorEl, setEmailAnchorEl] = useState(null);
	const [labelsAnchorEl, setLabelsAnchorEl] = useState(null);
	const [actionLoading, setActionLoading] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		async function fetchData() {
			const labelsResponse = await getEmailLabels();
			const emailsResponse = await getEmails();

			if (labelsResponse.status === 200 && emailsResponse.status === 200) {
				setLabels(labelsResponse.data);
				setEmails(emailsResponse.data);

				setOpen(true);
			}
		}

		fetchData();

		return () => disableDarkReader();
	}, []);

	function handleShowPreviousEmail() {
		const num = emails.findIndex(e => e.id === selectedEmail.id);

		if (num > 0) setSelectedEmail(emails[num - 1]);
	}

	function handleShowNextEmail() {
		const num = emails.findIndex(e => e.id === selectedEmail.id);

		if (num >= 0 && num < emails.length - 1) setSelectedEmail(emails[num + 1]);
	}

	function handleSelectEmail(email) {
		setSelectedEmail(email);
		setShowListView(false);

		enableDarkReader();
	}

	function handleUnselectEmail() {
		setSelectedEmail(null);
		setShowListView(true);

		disableDarkReader();
	}

	function handleOptionsClick(e, email) {
		setEmailAnchorEl(e.currentTarget);
		setSelectedEmail(email);
	}

	function handleCloseOptions() {
		setEmailAnchorEl(null);
	}

	function handleCloseLabelsOptions() {
		setLabelsAnchorEl(null);
	}

	async function handleDeleteEmail() {
		setActionLoading(true);

		const response = await deleteEmail(selectedEmail.id);

		if (response.status === 200) {
			setEmails(emails.filter(e => e.id !== selectedEmail.id));
		}

		setActionLoading(false);
	}

	function handleOpenLabelsList() {
		setLabelsAnchorEl(emailAnchorEl);
	}

	async function handleAddToLabelOption(label) {
		setActionLoading(true);

		const response = await editEmail(selectedEmail.id, label);

		if (response.status === 200) {
			setEmails(emails.filter(e => e.id !== selectedEmail.id));
		}

		setActionLoading(false);
	}

	function renderEmailAction(email) {
		if (selectedEmail && selectedEmail.id === email.id && actionLoading) {
			return <Loading />;
		}

		return (
			<ListItemSecondaryAction id={email.id} onClick={e => handleOptionsClick(e, email)}>
				<IconButton edge="end">
					<i className="icon-more" />
				</IconButton>
			</ListItemSecondaryAction>
		);
	}

	if (!open) return <Loading />;

	if (showListView) {
		const actions = [
			{ name: translate("moveToFolder"), onClick: handleOpenLabelsList },
			{ name: translate("delete"), onClick: handleDeleteEmail },
		];

		return (
			<Zoom in={open}>
				<Box
					display="flex"
					flexWrap="wrap"
					alignItems={emails.length ? "initial" : "center"}
					justifyContent="center"
					width="100%"
					height="100%"
					overflow="auto"
				>
					<InfiniteScroll
						initialLoad={false}
						loadMore={null}
						hasMore={false}
						useWindow={false}
						loader={<Loading key={0} />}
						style={{ width: "100%" }}
					>
						<AnimatedList>
							{emails.map(email =>
								[email.messages[email.messages.length - 1]].map(message => (
									<ListItem key={email.id} divider onClick={() => handleSelectEmail(email)}>
										<Box display="flex" flexDirection="column" flex="1 1 auto" minWidth={0}>
											<Typography variant="body1" title={message.subject}>
												{message.subject}
											</Typography>
											<Typography variant="body2" title={message.from.match(/<(.*)>/)[1]}>
												{message.from.match(/(.*) </)[1]}
											</Typography>
											<Typography variant="caption">{formatDate(message.dateSent, "DD-MM-YYYY HH:mm")}</Typography>
										</Box>
										{renderEmailAction(email)}
									</ListItem>
								)),
							)}
						</AnimatedList>
					</InfiniteScroll>
					<Menu anchorEl={emailAnchorEl} keepMounted open={Boolean(emailAnchorEl)} onClose={handleCloseOptions}>
						{actions.map(action => (
							<MenuItem
								key={action.name}
								onClick={() => {
									action.onClick();
									handleCloseOptions();
								}}
							>
								{action.name}
							</MenuItem>
						))}
					</Menu>
					<Menu
						anchorEl={labelsAnchorEl}
						keepMounted
						open={Boolean(labelsAnchorEl)}
						onClose={handleCloseLabelsOptions}
					>
						{labels.map(label => (
							<MenuItem
								key={label.id}
								onClick={() => {
									handleAddToLabelOption(label.id);
									handleCloseLabelsOptions();
								}}
							>
								{label.name}
							</MenuItem>
						))}
					</Menu>
				</Box>
			</Zoom>
		);
	}

	return (
		<Zoom in={open}>
			<SingleView
				open={open}
				content={
					<Box style={{ width: "100%", height: "100%", overflow: "auto", padding: "10px" }}>
						{parse(selectedEmail.messages[selectedEmail.messages.length - 1].data)}
					</Box>
				}
				onShowPrevious={handleShowPreviousEmail}
				onShowNext={handleShowNextEmail}
				onShowListView={handleUnselectEmail}
			/>
		</Zoom>
	);
}

export default Emails;
