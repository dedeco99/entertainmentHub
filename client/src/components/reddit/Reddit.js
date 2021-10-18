import React, { useContext, useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles, Grid, Button } from "@material-ui/core";

import Follows from "../.partials/Follows";
import Subscriptions from "../.partials/Subscriptions";
import FeedDetail from "../.partials/FeedDetail";
import Feeds from "../.partials/Feeds";
import Posts from "./Posts";

import { ActionContext } from "../../contexts/ActionContext";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Reddit() {
	const history = useHistory();
	const match = useRouteMatch();
	const classes = useStyles();
	const { dispatch } = useContext(ActionContext);
	const [blocks, setBlocks] = useState({
		openFeeds: false,
		openPosts: false,
	});
	const [openFeedDetail, setOpenFeedDetail] = useState(false);
	const [openFollows, setOpenFollows] = useState(false);

	function handleOpenFeedDetail() {
		setOpenFeedDetail(true);
	}

	function handleCloseFeedDetail() {
		setOpenFeedDetail(false);
	}

	function handleOpenFollows() {
		setOpenFollows(true);
	}

	function handleCloseFollows() {
		setOpenFollows(false);
	}

	function handleShowFeedsBlock() {
		setBlocks({ openFeeds: true, openPosts: false });
	}

	function handleShowPostsBlock() {
		setBlocks({ openFeeds: false, openPosts: true });
	}

	function handleShowFeeds() {
		history.push("/reddit");

		handleShowFeedsBlock();
	}

	function handleShowPosts(id) {
		if (match.params.sub !== id) {
			history.push(`/reddit/${id}/hot`);

			handleShowPostsBlock();
		}
	}

	useEffect(() => {
		switch (match.path) {
			case "/reddit":
				handleShowFeedsBlock();
				break;
			case "/reddit/:sub":
				if (match.params.sub === "undefined") {
					history.push("/reddit/");
				} else {
					history.push(`/reddit/${match.params.sub}/hot`);
				}
				break;
			case "/reddit/:sub/:category":
				if (match.params.sub === "undefined") {
					history.push("/reddit/");
				} else {
					handleShowPostsBlock();
				}
				break;
			default:
				break;
		}
	}, [match.url]);

	useEffect(() => {
		const actions = [
			{
				from: "reddit",
				name: "Add Subscriptions",
				icon: <i className="icon-user" />,
				handleClick: handleOpenFollows,
			},
			{ from: "reddit", name: "Add Feed", icon: <i className="icon-feed" />, handleClick: handleOpenFeedDetail },
		];

		function setupActions() {
			dispatch({ type: "ADD_ACTIONS", actions });
		}

		setupActions();

		return () => dispatch({ type: "DELETE_ACTIONS", from: "reddit" });
	}, []);

	function renderButtons() {
		return (
			<div align="center">
				<Button
					onClick={handleShowFeeds}
					className={classes.outlinedBtn}
					color="primary"
					variant="outlined"
					fullWidth
				>
					{"Feeds"}
				</Button>
			</div>
		);
	}

	function renderContent() {
		if (blocks.openFeeds) {
			return <Feeds platform="reddit" />;
		} else if (blocks.openPosts) {
			return <Posts />;
		}

		return <div />;
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={2} md={3} lg={2}>
				<Follows open={openFollows} platform="reddit" onClose={handleCloseFollows} />
				{renderButtons()}
				<Subscriptions
					platform="reddit"
					selected={match.params.sub}
					idField="externalId"
					action={handleShowPosts}
				/>
				<FeedDetail open={openFeedDetail} platform="reddit" onClose={handleCloseFeedDetail} />
			</Grid>
			<Grid item xs={12} sm={10} md={9} lg={10}>
				{renderContent()}
			</Grid>
		</Grid>
	);
}

export default Reddit;
