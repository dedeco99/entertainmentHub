import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import parse from "html-react-parser";

import { makeStyles, Zoom, Box, Typography, ListItem } from "@material-ui/core";

import Loading from "../.partials/Loading";
import AnimatedList from "../.partials/AnimatedList";

import { widget as widgetStyles } from "../../styles/Widgets";

import { getEmails } from "../../api/gmail";

import { formatDate } from "../../utils/utils";

const useStyles = makeStyles({ ...widgetStyles });

function Emails() {
	// eslint-disable-next-line no-unused-vars
	const classes = useStyles();
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
	}, []);

	function handleSelectEmail(email) {
		setSelectedEmail(email);
		setShowListView(false);
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
					height="100%"
					style={{ overflow: "auto" }}
				>
					<InfiniteScroll
						style={{ minWidth: "100%" }}
						initialLoad={false}
						loadMore={null}
						hasMore={false}
						useWindow={false}
						loader={<Loading key={0} />}
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
											<Typography variant="caption">
												{formatDate(message.dateToSend, "DD-MM-YYYY HH:mm")}
											</Typography>
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
			<Box onClick={() => setShowListView(true)} style={{ width: "100%", overflow: "auto" }}>
				{parse(selectedEmail.messages[selectedEmail.messages.length - 1].data)}
			</Box>
		</Zoom>
	);
}

export default Emails;
