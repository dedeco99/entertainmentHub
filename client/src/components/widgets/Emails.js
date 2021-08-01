import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import parse from "html-react-parser";
import { enable as enableDarkReader, disable as disableDarkReader } from "darkreader";

import { Zoom, Box, Typography, ListItem } from "@material-ui/core";

import Loading from "../.partials/Loading";
import AnimatedList from "../.partials/AnimatedList";
import SingleView from "../.partials/SingleView";

import { getEmails } from "../../api/gmail";

import { formatDate } from "../../utils/utils";

function Emails() {
	const [emails, setEmails] = useState([]);
	const [showListView, setShowListView] = useState(true);
	const [selectedEmail, setSelectedEmail] = useState(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		async function fetchData() {
			const response = await getEmails();

			if (response.status === 200) {
				setEmails(response.data);

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

	if (!open) return <Loading />;

	if (showListView) {
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
									<ListItem key={email._id} divider onClick={() => handleSelectEmail(email)}>
										<Box display="flex" flexDirection="column" flex="1 1 auto" minWidth={0}>
											<Typography variant="body1" title={message.subject}>
												{message.subject}
											</Typography>
											<Typography variant="body2" title={message.from.match(/<(.*)>/)[1]}>
												{message.from.match(/(.*) </)[1]}
											</Typography>
											<Typography variant="caption">{formatDate(message.dateSent, "DD-MM-YYYY HH:mm")}</Typography>
										</Box>
									</ListItem>
								)),
							)}
						</AnimatedList>
					</InfiniteScroll>
				</Box>
			</Zoom>
		);
	}

	return (
		<Zoom in={open}>
			<SingleView
				open={open}
				content={
					<Box style={{ width: "100%", overflow: "auto", padding: "10px" }}>
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
